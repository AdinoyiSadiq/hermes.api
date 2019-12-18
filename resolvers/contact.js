import ContactController from '../controllers/contactController';
import UserController from '../controllers/userController';
import { isAuth } from '../middleware/authentication';

const resolvers = {
  Contact: {
    user: (parent, args, { user }) => {
      const { userOneId, userTwoId } = parent;
      const userController = new UserController();
      const id = (user.userId === userOneId) ? userTwoId : userOneId;
      return userController.getSingleUser(id);
    },
  },
  Query: {
    getAllContacts: (parent, args, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.getAllContacts({ userId: user.userId, status: 1 });
    },
    getAllBlockedContacts: (parent, args, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.getAllContacts({ userId: user.userId, status: 3 });
    },
  },
  Mutation: {
    requestContact: (parent, { receiverId }, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.requestContact({ requesterId: user.userId, receiverId });
    },
    acceptContact: (parent, { requesterId }, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.acceptContact({ requesterId, receiverId: user.userId });
    },
    rejectContact: (parent, { requesterId }, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.rejectContact({ requesterId, receiverId: user.userId });
    },
    blockContact: (parent, { receiverId }, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.blockContact({ requesterId: user.userId, receiverId });
    },
  },
};

export default resolvers;
