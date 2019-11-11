import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    lastseen: Int!
  }

  type AuthUser {
    token: String!
    userId: Int!
  }

  type Query {
    signin(email: String!, password: String!): AuthUser!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthUser!
  }
`;

export default typeDefs;
