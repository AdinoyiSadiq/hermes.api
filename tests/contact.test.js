import models from '../models';
import ContactController from '../controllers/contactController';
import { resetDB, closeDbConnection } from './helpers/testDbHelper';

describe('contact controller', () => {
  let userOneId;
  let userTwoId;
  let userThreeId;
  let userFourId;

  beforeAll(async (done) => {
    const userOne = await models.user.create({
      username: 'userOne',
      email: 'userOne@gmail.com',
      password: 'userPassword',
    });
    const userTwo = await models.user.create({
      username: 'userTwo',
      email: 'userTwo@gmail.com',
      password: 'userPassword',
    });
    const userThree = await models.user.create({
      username: 'userThree',
      email: 'userThree@gmail.com',
      password: 'userPassword',
    });
    const userFour = await models.user.create({
      username: 'userFour',
      email: 'userFour@gmail.com',
      password: 'userPassword',
    });
    userOneId = userOne.dataValues.id
    userTwoId = userTwo.dataValues.id
    userThreeId = userThree.dataValues.id
    userFourId = userFour.dataValues.id
    done();
  });

  afterAll(async (done) => {
    await resetDB();
    await closeDbConnection();
    done();
  });

  it('should request, accept, reject, block, get a list of contacts and search for contacts', async (done) => {
    const contactController = new ContactController();
    /* Request Contact */
    // success: request contact
    const contactRequest = await contactController.requestContact({
      requesterId: userOneId,
      receiverId: userTwoId,
    });
    expect(contactRequest).toEqual(true);

    // error: request contact with the same userId for requesterId and receiverId
    try {
      await contactController.requestContact({ requesterId: userOneId, receiverId: userOneId });
    } catch (error) {
      expect(error).toHaveProperty('message', 'requesterId and receiver Id cannot be the same');
    }

    // error: request contact when a duplicate request has already been made
    try {
      await contactController.requestContact({       
        requesterId: userOneId,
        receiverId: userTwoId, 
      });
    } catch (error) {
      expect(error).toHaveProperty('message', 'unable to complete this request');
    }

    /* Accept Contact */
    // success: accept contact
    const acceptContact = await contactController.acceptContact({
      requesterId: userOneId,
      receiverId: userTwoId,
    });
    expect(acceptContact).toEqual(true);

    // error: accept contact with the same userId for requesterId and receiverId
    try {
      await contactController.acceptContact({ requesterId: userOneId, receiverId: userOneId });
    } catch (error) {
      expect(error).toHaveProperty('message', 'requesterId and receiver Id cannot be the same');
    }

    // error: accept contact request where no request was found
    try {
      await contactController.acceptContact({ requesterId: userOneId, receiverId: userThreeId });
    } catch (error) {
      expect(error).toHaveProperty('message', 'the contact request does not exist');
    }

    /* Reject Contact */
    // reject contact
    await contactController.requestContact({
      requesterId: userOneId,
      receiverId: userThreeId,
    });
    const rejectContact = await contactController.rejectContact({
      requesterId: userOneId,
      receiverId: userThreeId,
    });
    expect(rejectContact).toEqual(true);

    // error: reject contact with the same userId for requesterId and receiverId
    try {
      await contactController.rejectContact({ requesterId: userOneId, receiverId: userOneId });
    } catch (error) {
      expect(error).toHaveProperty('message', 'requesterId and receiver Id cannot be the same');
    }

    // error: reject contact request where no request was found
    try {
      await contactController.rejectContact({ requesterId: userOneId, receiverId: userFourId });
    } catch (error) {
      expect(error).toHaveProperty('message', 'the contact request does not exist');
    }

    /* Get All Contacts */
    // success: get all contacts
    const contacts = await contactController.getAllContacts({ 
      userId: userOneId, 
      status: 1,
    });
    expect(contacts.length).toEqual(1);

    // error: get all contacts when user is not found
    try {
      await contactController.getAllContacts({ userId: 1000000, status: 1 });
    } catch (error) {
      expect(error).toHaveProperty('message', 'the user does not exist');
    }

    // block contact
    const blockContact = await contactController.blockContact({
      requesterId: userOneId,
      receiverId: userThreeId,
    });
    expect(blockContact).toEqual(true);

    // get all blocked contacts
    const blockedContacts = await contactController.getAllContacts({ 
      userId: userOneId, 
      status: 3,
    });
    expect(blockedContacts.length).toEqual(1);

    /* Search Contacts */
    // success: search contacts
    const searchedContacts = await contactController.searchContacts({
      userId: userOneId,
      searchTerm: 'userTwo'
    });
    expect(searchedContacts.length).toEqual(1);

    // error: search all contacts when the user is not found
    try {
      await contactController.searchContacts({
        userId: (userOneId + 100000000),
        searchTerm: 'userTwo'
      });
    } catch (error) {
      expect(error).toHaveProperty('message', 'the user does not exist');
    }

    // error: search all contacts when a search term is not provided
    try {
      await contactController.searchContacts({
        userId: userOneId,
        searchTerm: ''
      });
    } catch (error) {
      expect(error).toHaveProperty('message', 'please provide a search term');
    }
    done();
  });
});
