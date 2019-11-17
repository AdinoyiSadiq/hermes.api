import ProfileController from '../controllers/profileController';
import { isAuth } from '../middleware/authentication';

const resolvers = {
  Query: {
    getProfile: (parent, { userId }, { user }) => {
      isAuth(user);
      const profileController = new ProfileController();
      return profileController.getProfile(userId);
    },
  },
  Mutation: {
    updateProfile: (parent, profileDetails, { user }) => {
      isAuth(user);
      const profileController = new ProfileController();
      return profileController.updateProfile({ ...profileDetails, user });
    },
  },
};

export default resolvers;
