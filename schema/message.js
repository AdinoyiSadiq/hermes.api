import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Message {
    id: Int!
    text: String!
    image: String
    edited: Boolean
    sender: User!
    receiver: User
    quote: [Message]!
    createdAt: String!
    updatedAt: String!
  }

  type Subscription {
    message(senderId: Int!, receiverId: Int!): Message
    deletedMessage(senderId: Int!, receiverId: Int!): Message!
  }

  type Query {
    getMessages(offset: Int, limit: Int, receiverId: Int!): [Message]!
  }

  type Mutation {
    createMessage(text: String!, receiverId: Int, quoteId: Int, image: String): Message!
    updateMessage(text: String!, messageId: Int!): Message!
    deleteMessage(messageId: Int!): Message!
  }
`;

export default typeDefs;
