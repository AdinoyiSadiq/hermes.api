import ProfileController from '../controllers/profileController';
import UserController from '../controllers/userController';
import { isAuth } from '../middleware/authentication';

const resolvers = {
  Query: {
    getProfile: async (parent, { userId }, { user }) => {
      isAuth(user);
      const profileController = new ProfileController();
      const userController = new UserController();
      const userDetails = await userController.getSingleUser(userId);
      const profileDetails = await profileController.getProfile(userId);
      return {
        id: userId,
        username: userDetails.username,
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        location: profileDetails.location,
      };
    },
  },
  Mutation: {
    updateProfile: async (parent, profileDetails, { user }) => {
      isAuth(user);
      const profileController = new ProfileController();
      const userController = new UserController();
      const updateUser = await userController.updateUser({
        username: profileDetails.username,
        firstname: profileDetails.firstname,
        lastname: profileDetails.lastname,
        user,
      });
      const updatedProfile = await profileController.updateProfile({
        location: profileDetails.location,
        user,
      });
      return {
        id: user.userId,
        username: updateUser.username,
        firstname: updateUser.firstname,
        lastname: updateUser.lastname,
        location: updatedProfile.location,
      };
    },
  },
};

export default resolvers;
