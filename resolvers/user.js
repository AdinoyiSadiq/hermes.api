import { PubSub, withFilter } from 'apollo-server-express';
import UserController from '../controllers/userController';
import ContactController from '../controllers/contactController';
import ProfileController from '../controllers/profileController';
import validate from '../middleware/validation';
import { isAuth } from '../middleware/authentication';

const pubsub = new PubSub();
const TYPING = 'TYPING';

const resolvers = {
  UserSearch: {
    user: (parent) => {
      const searchedUser = parent.dataValues;
      return {
        id: searchedUser.id,
        username: searchedUser.username,
        firstname: searchedUser.firstname,
        lastname: searchedUser.lastname,
        lastseen: searchedUser.lastseen,
      };
    },
    profileImage: async (parent) => {
      const searchedUser = parent.dataValues;
      const profileController = new ProfileController();
      const { profileImage } = await profileController.getProfileImage(searchedUser.id);
      return profileImage;
    },
    contact: async (parent, args, { user }) => {
      const searchedUser = parent.dataValues;
      const contactController = new ContactController();
      const contact = await contactController.getContact({
        requesterId: user.userId,
        receiverId: searchedUser.id,
      });

      return {
        status: (contact && contact.dataValues && contact.dataValues.status),
        actionUserId: (contact && contact.dataValues && contact.dataValues.actionUserId),
      };
    },
  },
  Subscription: {
    // is it possible to authenticate this subscription?
    typing: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TYPING]),
        (payload, args) => (
          (payload.receiverId === args.receiverId) && (payload.senderId === args.senderId)
        ),
      ),
    },
  },
  Query: {
    getAuthUser: (parent, args, { user }) => {
      isAuth(user);
      const userController = new UserController();
      return userController.getSingleUser(user.userId);
    },
    searchUsers: (parent, { searchTerm }, { user }) => {
      isAuth(user);
      const userController = new UserController();
      return userController.searchUsers({ userId: user.userId, searchTerm });
    },
    signin: (parent, userDetails) => {
      validate('signin', userDetails);
      const userController = new UserController();
      return userController.signin(userDetails);
    },
  },
  Mutation: {
    userTyping: (parent, { senderId, receiverId }, { user }) => {
      isAuth(user);
      pubsub.publish(TYPING, {
        senderId,
        receiverId,
        typing: true,
      });
      return true;
    },
    signup: (parent, userDetails) => {
      validate('signup', userDetails);
      const userController = new UserController();
      return userController.signup(userDetails);
    },
  },
};

export default resolvers;
