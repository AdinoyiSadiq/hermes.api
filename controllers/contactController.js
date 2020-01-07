/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import models from '../models';

class Contact {
  constructor() {
    this.contactModel = models.contact;
    this.userModel = models.user;
  }

  async requestContact({ requesterId, receiverId }) {
    if (requesterId === receiverId) {
      const error = new Error('requesterId and receiver Id cannot be the same');
      error.code = 422;
      throw error;
    }
    const contactRequest = await this.contactModel.findOne({
      where: {
        userOneId: requesterId,
        userTwoId: receiverId,
        status: {
          [Op.or]: [0, 1, 3],
        },
      },
    });
    if (contactRequest) {
      const error = new Error('unable to complete this request');
      error.code = 422;
      throw error;
    }
    await this.contactModel.create({
      userOneId: requesterId,
      userTwoId: receiverId,
      actionUserId: requesterId,
    });
    return true;
  }

  async acceptContact({ requesterId, receiverId }) {
    if (requesterId === receiverId) {
      const error = new Error('requesterId and receiver Id cannot be the same');
      error.code = 422;
      throw error;
    }
    const contactRequest = await this.contactModel.findOne({
      where: {
        userOneId: requesterId,
        userTwoId: receiverId,
        status: 0,
      },
    });

    if (!contactRequest) {
      const error = new Error('the contact request does not exist');
      error.code = 422;
      throw error;
    }

    await contactRequest.update({
      status: 1,
      actionUserId: receiverId,
    });
    return true;
  }

  async rejectContact({ requesterId, receiverId }) {
    if (requesterId === receiverId) {
      const error = new Error('requesterId and receiver Id cannot be the same');
      error.code = 422;
      throw error;
    }
    const contactRequest = await this.contactModel.findOne({
      where: {
        userOneId: requesterId,
        userTwoId: receiverId,
        status: 0,
      },
    });

    if (!contactRequest) {
      const error = new Error('the contact request does not exist');
      error.code = 422;
      throw error;
    }
    await contactRequest.update({
      status: 2,
      actionUserId: receiverId,
    });
    return true;
  }

  async blockContact({ requesterId, receiverId }) {
    if (requesterId === receiverId) {
      const error = new Error('requesterId and receiver Id cannot be the same');
      error.code = 422;
      throw error;
    }
    const contactRequest = await this.contactModel.findOne({
      where: {
        [Op.or]: [
          {
            userOneId: requesterId,
            userTwoId: receiverId,
          },
          {
            userOneId: receiverId,
            userTwoId: requesterId,
          },
        ],
      },
    });

    if (!contactRequest) {
      const error = new Error('the contact request does not exist');
      error.code = 422;
      throw error;
    }
    await contactRequest.update({
      status: 3,
      actionUserId: requesterId,
    });
    return true;
  }

  async getAllContacts({ userId, status }) {
    const user = await this.userModel.findOne({ where: { id: userId } });

    if (!user) {
      const error = new Error('the user does not exist');
      error.code = 404;
      throw error;
    }

    const contacts = await this.contactModel.findAll({
      where: {
        status,
        [Op.or]: [
          {
            userOneId: {
              [Op.eq]: userId,
            },
          },
          {
            userTwoId: {
              [Op.eq]: userId,
            },
          },
        ],
      },
      include: [
        {
          model: this.userModel,
          as: 'userOne',
        },
        {
          model: this.userModel,
          as: 'userTwo',
        },
      ],
    });
    return [...contacts];
  }

  async searchContacts({ userId, searchTerm }) {
    const user = await this.userModel.findOne({ where: { id: userId } });

    if (!user) {
      const error = new Error('the user does not exist');
      error.code = 404;
      throw error;
    }

    if (!searchTerm) {
      const error = new Error('please provide a search term');
      error.code = 400;
      throw error;
    }

    const contacts = await this.contactModel.findAll({
      where: {
        [Op.or]: [
          {
            userTwoId: { [Op.eq]: userId },
            [Op.or]: [
              { '$userOne.username$': { [Op.iLike]: `%${searchTerm}%` } },
              models.Sequelize.where(models.Sequelize.fn('concat', models.Sequelize.col('userOne.firstname'), ' ', models.Sequelize.col('userOne.lastname')), {
                [Op.iLike]: `%${searchTerm}%`,
              }),
            ],
          },
          {
            userOneId: { [Op.eq]: userId },
            [Op.or]: [
              { '$userTwo.username$': { [Op.iLike]: `%${searchTerm}%` } },
              models.Sequelize.where(models.Sequelize.fn('concat', models.Sequelize.col('userTwo.firstname'), ' ', models.Sequelize.col('userTwo.lastname')), {
                [Op.iLike]: `%${searchTerm}%`,
              }),
            ],
          },
        ],
      },
      include: [
        {
          model: this.userModel,
          as: 'userOne',
        },
        {
          model: this.userModel,
          as: 'userTwo',
        },
      ],
    });
    return [...contacts];
  }
}

export default Contact;
