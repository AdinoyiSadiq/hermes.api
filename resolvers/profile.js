import ProfileController from '../controllers/profileController';
import UserController from '../controllers/userController';
import { isAuth } from '../middleware/authentication';

const resolvers = {
  Query: {
    getProfile: async (parent, { userId }, { user }) => {
      isAuth(user);
      const profileController = new ProfileController();
      const userController = new UserController();
      const id = userId || user.userId;
      const userDetails = await userController.getSingleUser(id);
      const profileDetails = await profileController.getProfile(id);
      return {
        id: userId,
        username: userDetails.username,
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        email: userDetails.email,
        profileImage: profileDetails.profileImage,
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
        email: profileDetails.email,
        user,
      });
      const updatedProfile = await profileController.updateProfile({
        profileImage: profileDetails.profileImage,
        location: profileDetails.location,
        user,
      });
      return {
        id: user.userId,
        username: updateUser.username,
        firstname: updateUser.firstname,
        lastname: updateUser.lastname,
        email: updateUser.email,
        profileImage: updatedProfile.profileImage,
        location: updatedProfile.location,
      };
    },
  },
};

export default resolvers;
