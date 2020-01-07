import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import moment from 'moment';
import models from '../models';
import ProfileController from './profileController';

dotenv.config();

class User {
  constructor() {
    this.userModel = models.user;
    this.profileModel = models.profile;
  }

  async getSingleUser(userId) {
    const user = await this.userModel.findOne({ where: { id: userId } });

    if (!user) {
      const error = new Error('this user does not exist');
      error.code = 401;
      throw error;
    }
    // Note: Ensure that a Date type is created to handle lastseen for the user object
    const lastseen = moment(user.lastseen, 'YYYY-MM-DD HH:mm:ss').format();
    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      lastseen,
    };
  }

  async updateUser(userDetails) {
    const {
      username, firstname, lastname, user: { userId },
    } = userDetails;
    const user = await this.userModel.findOne({ where: { id: userId } });

    if (!user) {
      const error = new Error('this user does not exist');
      error.code = 401;
      throw error;
    }

    const updatedUser = await user.update({
      username: username || user.username,
      firstname: firstname || user.firstname,
      lastname: lastname || user.lastname,
    });

    return updatedUser;
  }

  async signin(userDetails) {
    const { email, password } = userDetails;
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      const error = new Error('the account with this email does not exist');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign({ userId: user.id }, process.env.SESSION_SECRET, { expiresIn: '24h' });
    return {
      token,
      userId: user.id,
    };
  }

  async signup(userDetails) {
    const existingUser = await this.userModel.findOne({ where: { email: userDetails.email } });
    if (existingUser) {
      const error = new Error('user with this email already exits');
      error.code = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(userDetails.password, 12);
    const user = await this.userModel.create({
      username: userDetails.username,
      firstname: userDetails.firstname,
      lastname: userDetails.lastname,
      email: userDetails.email,
      password: hashedPassword,
    });
    if (user) {
      const profileController = new ProfileController();
      profileController.createProfile({
        location: userDetails.location,
        userId: user.id,
      });
    }
    const token = jwt.sign({ userId: user.id }, process.env.SESSION_SECRET, { expiresIn: '24h' });
    return {
      token,
      userId: user.id,
    };
  }
}

export default User;
