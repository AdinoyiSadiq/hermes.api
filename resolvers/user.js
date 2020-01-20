import UserController from '../controllers/userController';
import validate from '../middleware/validation';
import { isAuth } from '../middleware/authentication';

const resolvers = {
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
    signup: (parent, userDetails) => {
      validate('signup', userDetails);
      const userController = new UserController();
      return userController.signup(userDetails);
    },
  },
};

export default resolvers;
