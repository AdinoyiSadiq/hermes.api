import models from '../models';
import UserController from '../controllers/userController';
import { resetDB, closeDbConnection } from './helpers/testDbHelper';

describe('active user controller', () => {
  let userOneId;

  beforeAll(async (done) => {
    const userOne = await models.user.create({
      username: 'firstUserOne',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'firstUser@gmail.com',
      password: 'userPassword',
    });
    userOneId = userOne.dataValues.id
    done();
  });

  afterAll(async (done) => {
    await resetDB();
    await closeDbConnection();
    done();
  });

  it('should update user details', async (done) => {
    const userController = new UserController();
    const user = await userController.updateUser({
      username: 'updatedUsername',
      firstname: 'updatedFirstname',
      lastname: 'updatedLastname',
      email: 'updatedEmail@gmail.com',
      user: { userId: userOneId },
    });

    expect(user.firstname).toEqual('updatedFirstname');
    done();
  });
});