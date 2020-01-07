import moment from 'moment';
import ContactController from '../controllers/contactController';
import { isAuth } from '../middleware/authentication';

const resolvers = {
  Contact: {
    user: (parent, args, { user }) => {
      const { userOneId, userOne, userTwo } = parent;
      const userDetails = (user.userId === userOneId) ? userTwo : userOne;
      const lastseen = moment(userDetails.lastseen, 'YYYY-MM-DD HH:mm:ss').format();
      return {
        id: userDetails.id,
        username: userDetails.username,
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        lastseen,
      };
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
    searchContacts: (parent, { searchTerm }, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.searchContacts({ userId: user.userId, searchTerm });
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
