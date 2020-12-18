const { gql } = require("apollo-server");

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    author: User
  }
  type User {
    id: ID!
    username: String!
  }
  type AuthData {
    id: ID!
    username: String!
    token: String!
    toknExpiration: Int!
  }
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
    bio: String
  }
  type Query {
    getPosts: [Post!]!
  }
`;

module.exports = typeDefs;
