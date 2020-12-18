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
    email: String!
    bio: String
  }
  type AuthData {
    id: ID!
    username: String!
    token: String!
    tokenExpiration: Int!
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
    login(username: String!, password: String!): AuthData!
  }
  type Mutation {
    register(registerInput: RegisterInput): AuthData!
    createPost(body: String!): Post!
  }
`;

module.exports = typeDefs;
