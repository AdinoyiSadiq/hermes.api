import ActiveUserController from '../controllers/activeuserController';
import MessageController from '../controllers/messageController';
import { isAuth } from '../middleware/authentication';

const resolvers = {
  ActiveUser: {
    user: (parent, args, { user }) => {
      const { userOneId, userOne, userTwo } = parent;
      const userDetails = (user.userId === userOneId) ? userTwo : userOne;
      return userDetails;
    },
    lastMessage: (parent) => {
      const { userOneId, userTwoId } = parent;
      const messageController = new MessageController();
      return messageController.getLastMessage({ userOneId, userTwoId });
    },
  },
  Query: {
    getActiveUsers: (parent, args, { user }) => {
      isAuth(user);
      const activeuserController = new ActiveUserController();
      return activeuserController.getActiveUsers(user.userId);
    },
  },
};

export default resolvers;
