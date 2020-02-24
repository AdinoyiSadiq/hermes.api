import models from '../models';
import MessageController from '../controllers/messageController';
import { resetDB, closeDbConnection } from './helpers/testDbHelper';

describe('message controller', () => {
  let userOneId
  let userTwoId
  beforeAll(async (done) => {
    const userOne = await models.user.create({
      username: 'userOne',
      email: 'userOne@gmail.com',
      password: 'userPassword',
    });
    const userTwo = await models.user.create({
      username: 'userTwo',
      email: 'userTwo@gmail.com',
      password: 'userPassword',
    });
    userOneId = userOne.dataValues.id
    userTwoId = userTwo.dataValues.id
    done();
  });

  afterAll(async (done) => {
    await resetDB();
    await closeDbConnection();
    done();
  });

  it('should create, get, update and delete a message', async (done) => {
    // create user message
    const messageController = new MessageController();
    const message = await messageController.createMessage({
      text: 'This is the text',
      receiverId: userTwoId,
      senderId: userOneId,
    });
    expect(message.text).toEqual('This is the text');

    // update user message
    const updatedMessages = await messageController.updateMessages({
      state: 'read',
      messageIds: [message.id],
    });
    expect(updatedMessages[0].state).toEqual('read');

    // get user message
    const singleMessage = await messageController.getMessage({ messageId: message.id });
    expect(singleMessage[0].text).toEqual('This is the text');

    // get list of user messages
    const messages = await messageController.getMessages({ 
      senderId: userOneId, 
      receiverId: userTwoId 
    });
    expect(messages.length).toEqual(1);

    // quote a user message
    const secondMessageWithQuote = await messageController.createMessage({
      text: 'This is the text for the message with quote',
      quoteId: message.id,
      receiverId: userTwoId,
      senderId: userOneId,
    });
    expect(secondMessageWithQuote.quoteId).toEqual(message.id);

    // delete user message
    const deletedSuccessfully = await messageController.deleteMessage({ 
      messageId: message.id, 
      userId: userOneId 
    });
    expect(deletedSuccessfully).toBeTruthy();
    done();
  });
});