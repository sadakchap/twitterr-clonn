const { gql } = require("apollo-server");

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    author: User
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
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
    getPost(postId: ID!): Post!
    login(username: String!, password: String!): AuthData!
  }
  type Mutation {
    register(registerInput: RegisterInput): AuthData!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    updatePost(postId: ID!, body: String!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
  }
`;

module.exports = typeDefs;
