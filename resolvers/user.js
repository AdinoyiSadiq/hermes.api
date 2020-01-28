import { PubSub, withFilter } from 'apollo-server-express';
import UserController from '../controllers/userController';
import validate from '../middleware/validation';
import { isAuth } from '../middleware/authentication';

const pubsub = new PubSub();
const TYPING = 'TYPING';

const resolvers = {
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
