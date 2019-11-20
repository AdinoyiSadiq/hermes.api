import MessageController from '../controllers/messageController';
import UserController from '../controllers/userController';
import { isAuth } from '../middleware/authentication';

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
  Query: {
    getMessages: (parent, { receiverId }, { user }) => {
      isAuth(user);
      const messageController = new MessageController();
      return messageController.getMessages({ receiverId, senderId: user.userId });
    },
  },
  Mutation: {
    createMessage: (parent, messageDetails, { user }) => {
      isAuth(user);
      const messageController = new MessageController();
      return messageController.createMessage({
        ...messageDetails,
        senderId: user.userId,
      });
    },
    updateMessage: (parent, messageDetails, { user }) => {
      isAuth(user);
      const messageController = new MessageController();
      return messageController.updateMessage({
        ...messageDetails,
        userId: user.userId,
      });
    },
    deleteMessage: (parent, { messageId }, { user }) => {
      isAuth(user);
      const messageController = new MessageController();
      return messageController.deleteMessage({ messageId, userId: user.userId });
    },
  },
};

export default resolvers;
