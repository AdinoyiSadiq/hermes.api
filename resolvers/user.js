import UserController from '../controllers/userController';
import validate from '../middleware/validation';

const resolvers = {
  Query: {
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
