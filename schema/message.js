import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Message {
    id: Int!
    text: String!
    edited: Boolean
    sender: User!
    receiver: User
    quote: [Message]!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getMessages(offset: Int, receiverId: Int!): [Message]!
  }

  type Mutation {
    createMessage(text: String!, receiverId: Int, quoteId: Int): Message!
    updateMessage(text: String!, messageId: Int!): Message!
    deleteMessage(messageId: Int!): Boolean!
  }
`;

export default typeDefs;
