import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Profile {
    id: Int!
    username: String!
    firstname: String!
    lastname: String!
    location: String!
    profileImage: String
  }

  type Query {
    getProfile(userId: Int!): Profile!
  }

  type Mutation {
    updateProfile(
      username: String
      firstname: String
      lastname: String
      location: String
    ): Profile!
  }
`;

export default typeDefs;
