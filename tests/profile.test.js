import models from '../models';
import ProfileController from '../controllers/profileController';
import { resetDB, closeDbConnection } from './helpers/testDbHelper';

describe('profile controller', () => {
  let userId
  beforeAll(async (done) => {
    const user = await models.user.create({
      username: 'newuser',
      email: 'newuser@gmail.com',
      password: 'userpassword',
    });
    userId = user.dataValues.id
    done();
  });

  afterAll(async (done) => {
    await resetDB();
    await closeDbConnection();
    done();
  });

  it('should create, get and update user profile', async (done) => {
    // create user profile
    const profileController = new ProfileController();
    const profile = await profileController.createProfile({
      firstname: 'firstname',
      lastname: 'lastname',
      location: 'location',
      userId,
    });
    expect(profile.userId).toEqual(userId);

    // get user profile
    const userProfile = await profileController.getProfile(userId);
    expect(userProfile.id).toEqual(profile.id);

    // update user profile
    const updatedProfile = await profileController.updateProfile({
      firstname: 'updatedFirstname',
      lastname: 'updatedLastname',
      location: 'updatedLocation',
      user: { userId },
    });

    expect(updatedProfile.firstname).toEqual('updatedFirstname');
    expect(updatedProfile.lastname).toEqual('updatedLastname');
    expect(updatedProfile.location).toEqual('updatedLocation');
    done();
  });
});