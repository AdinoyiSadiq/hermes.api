import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Contact {
    id: Int!
    status: Int!
    user: User!
  }

  type Query {
    getAllContacts: [Contact]!
    getAllBlockedContacts: [Contact]!
  }

  type Mutation {
    requestContact(receiverId: Int!): Boolean!
    acceptContact(requesterId: Int!): Boolean!
    rejectContact(userId: Int!): Boolean!
    blockContact(userId: Int!): Boolean!
  }
`;

export default typeDefs;
