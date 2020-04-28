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

  type UserContactStatus {
    status: Int
    actionUserId: Int
  }

  type UserSearch {
    user: User!
    profileImage: String
    contact: UserContactStatus
  }

  type Subscription {
    typing(senderId: Int!, receiverId: Int!): Boolean!
  }

  type Query {
    signin(email: String!, password: String!): AuthUser!
    searchUsers(searchTerm: String!): [UserSearch]!
    getAuthUser: User!
  }

  type Mutation {
    userTyping(senderId: Int!, receiverId: Int!): Boolean!
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
