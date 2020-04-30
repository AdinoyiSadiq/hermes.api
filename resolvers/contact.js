import { PubSub, withFilter } from 'apollo-server-express';
import ContactController from '../controllers/contactController';
import ProfileController from '../controllers/profileController';
import { isAuth } from '../middleware/authentication';

const pubsub = new PubSub();
const ACCEPT_CONTACT = 'ACCEPT_CONTACT';

const resolvers = {
  Contact: {
    user: (parent, args, { user }) => {
      const { userOneId, userOne, userTwo } = parent;
      const userDetails = (user.userId === userOneId) ? userTwo : userOne;
      return {
        id: userDetails.id,
        username: userDetails.username,
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        lastseen: userDetails.lastseen,
      };
    },
    profileImage: async (parent, args, { user }) => {
      const { userOneId, userOne, userTwo } = parent;
      const userDetails = (user.userId === userOneId) ? userTwo : userOne;
      const profileController = new ProfileController();
      const { profileImage } = await profileController.getProfileImage(userDetails.id);
      return profileImage;
    },
  },
  Subscription: {
    acceptedContact: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ACCEPT_CONTACT]),
        (payload, args) => (
          (payload.receiverId === args.receiverId) && (payload.requesterId === args.requesterId)
        ),
      ),
    },
  },
  Query: {
    getSentContactRequests: (parent, args, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.getSentContactRequests({ userId: user.userId });
    },
    getReceivedContactRequests: (parent, args, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.getReceivedContactRequests({ userId: user.userId });
    },
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
    getRejectedContactRequests: (parent, args, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.getRejectedContactRequests({ userId: user.userId });
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
    cancelContactRequest: (parent, { receiverId }, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      return contactController.cancelContactRequest({ requesterId: user.userId, receiverId });
    },
    acceptContact: async (parent, { requesterId }, { user }) => {
      isAuth(user);
      const contactController = new ContactController();
      const acceptContact = await contactController.acceptContact({
        requesterId, receiverId: user.userId,
      });
      pubsub.publish(ACCEPT_CONTACT, {
        requesterId,
        receiverId: user.userId,
        acceptedContact: true,
      });
      return acceptContact;
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
