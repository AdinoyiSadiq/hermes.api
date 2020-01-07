import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: Int!
    firstname: String!
    lastname: String! 
    username: String!
    email: String!
    lastseen: String!
  }

  type AuthUser {
    token: String!
    userId: Int!
  }

  type Query {
    signin(email: String!, password: String!): AuthUser!
  }

  type Mutation {
    signup(
      firstname: String!
      lastname: String! 
      username: String!, 
      email: String!, 
      password: String!
      location: String!
    ): AuthUser!
  }
`;

export default typeDefs;
