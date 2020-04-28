import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Contact {
    id: Int!
    status: Int!
    actionUserId: Int!
    profileImage: String
    user: User!
  }

  type Query {
    getAllContacts: [Contact]!
    getAllBlockedContacts: [Contact]!
    getSentContactRequests: [Contact]!
    getReceivedContactRequests: [Contact]!
    getRejectedContactRequests: [Contact]!
    searchContacts(searchTerm: String!): [Contact]!
  }

  type Mutation {
    requestContact(receiverId: Int!): Boolean!
    cancelContactRequest(receiverId: Int!): Boolean!
    acceptContact(requesterId: Int!): Boolean!
    rejectContact(requesterId: Int!): Boolean!
    blockContact(userId: Int!): Boolean!
  }
`;

export default typeDefs;
