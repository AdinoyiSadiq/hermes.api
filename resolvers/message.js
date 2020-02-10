import { PubSub, withFilter } from 'apollo-server-express';
import MessageController from '../controllers/messageController';
import UserController from '../controllers/userController';
import { isAuth } from '../middleware/authentication';


const pubsub = new PubSub();
const MESSAGE = 'MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';

const resolvers = {
  Message: {
    sender: (parent) => {
      const userController = new UserController();
      return userController.getSingleUser(parent.senderId);
    },
    receiver: (parent) => {
      const userController = new UserController();
      return userController.getSingleUser(parent.receiverId);
    },
    quote: (parent) => {
      const messageController = new MessageController();
      return messageController.getMessage({ messageId: parent.quoteId, quote: true });
    },
  },
  Subscription: {
    // is it possible to authenticate this subscription?
    message: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE]),
        (payload, args) => (
          (payload.receiverId === args.receiverId) && (payload.senderId === args.senderId)
        ),
      ),
    },
    deletedMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([DELETE_MESSAGE]),
        (payload, args) => (
          ((payload.receiverId === args.receiverId) && (payload.senderId === args.senderId))
          || ((payload.senderId === args.receiverId) && (payload.receiverId === args.senderId))
        ),
      ),
    },
  },
  Query: {
    getMessages: (parent, { receiverId, offset, limit }, { user }) => {
      isAuth(user);
      const messageController = new MessageController();
      return messageController.getMessages({
        receiverId, senderId: user.userId, offset, limit,
      });
    },
  },
  Mutation: {
    createMessage: async (parent, messageDetails, { user }) => {
      isAuth(user);
      const messageController = new MessageController();
      const message = await messageController.createMessage({
        ...messageDetails,
        senderId: user.userId,
      });
      pubsub.publish(MESSAGE, {
        message,
        senderId: message.dataValues.senderId,
        receiverId: message.dataValues.receiverId,
      });
      return message;
    },
    updateMessage: (parent, messageDetails, { user }) => {
      isAuth(user);
      const messageController = new MessageController();
      return messageController.updateMessage({
        ...messageDetails,
        userId: user.userId,
      });
    },
    deleteMessage: async (parent, { messageId }, { user }) => {
      isAuth(user);
      const messageController = new MessageController();
      const deletedMessage = await messageController.deleteMessage({
        messageId,
        userId: user.userId,
      });
      pubsub.publish(DELETE_MESSAGE, {
        deletedMessage,
        senderId: deletedMessage.dataValues.senderId,
        receiverId: deletedMessage.dataValues.receiverId,
      });
      return deletedMessage;
    },
  },
};

export default resolvers;
