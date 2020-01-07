import models from '../models';
import MessageController from '../controllers/messageController';
import ActiveUserController from '../controllers/activeuserController';
import { resetDB, closeDbConnection } from './helpers/testDbHelper';

describe('active user controller', () => {
  let userOneId;
  let userTwoId;

  beforeAll(async (done) => {
    const userOne = await models.user.create({
      username: 'firstUser',
      email: 'firstUser@gmail.com',
      password: 'userPassword',
    });
    const userTwo = await models.user.create({
      username: 'secondUser',
      email: 'secondUser@gmail.com',
      password: 'userPassword',
    });
    userOneId = userOne.dataValues.id
    userTwoId = userTwo.dataValues.id

    const messageController = new MessageController();
    const message = await messageController.createMessage({
      text: 'This is the text',
      receiverId: userTwoId,
      senderId: userOneId,
    });
    done();
  });

  afterAll(async (done) => {
    await resetDB();
    await closeDbConnection();
    done();
  });

  it('should get all active users', async (done) => {
    const activeuserController = new ActiveUserController();
    const activeuser = await activeuserController.getActiveUsers(userOneId);
    expect(activeuser[0].dataValues.userTwoId).toEqual(userTwoId)
    done();
  });
});