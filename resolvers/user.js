import UserController from '../controllers/userController';

const resolvers = {
  Query: {
    signin: (parent, { email, password }) => {
      const userController = new UserController();
      return userController.signin({ email, password });
    },
  },
  Mutation: {
    signup: (parent, { username, email, password }) => {
      const userController = new UserController();
      return userController.signup({ username, email, password });
    },
  },
};

export default resolvers;
