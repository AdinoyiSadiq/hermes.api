import ActiveUserController from '../controllers/activeuserController';
import MessageController from '../controllers/messageController';
import ProfileController from '../controllers/profileController';
import { isAuth } from '../middleware/authentication';

const resolvers = {
  ActiveUser: {
    user: (parent, args, { user }) => {
      const { userOneId, userOne, userTwo } = parent;
      const userDetails = (user.userId === userOneId) ? userTwo : userOne;
      return userDetails;
    },
    profileImage: async (parent, args, { user }) => {
      const { userOneId, userOne, userTwo } = parent;
      const userDetails = (user.userId === userOneId) ? userTwo : userOne;
      const profileController = new ProfileController();
      const { profileImage } = await profileController.getProfileImage(userDetails.id);
      return profileImage;
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
