import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type ActiveUser {
    id: Int!
    user: User!
    lastMessage: Message
  }

  type Query {
    getActiveUsers: [ActiveUser]!
  }
`;

export default typeDefs;
