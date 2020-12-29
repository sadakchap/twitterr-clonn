const { gql } = require("apollo-server");

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    author: User
    comments: [Comment!]!
    likes: [Like!]!
    likesCount: Int!
    commentsCount: Int!
  }
  type Like {
    id: ID!
    username: String!
    createdAt: String!
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
    name: String!
    email: String!
    bio: String
    posts: [Post!]!
    profile_pic: String
  }
  type AuthData {
    id: ID!
    username: String!
    token: String!
    tokenExpiration: Int!
  }
  input RegisterInput {
    name: String!
    email: String!
    password: String!
    bio: String
  }
  type Query {
    getPosts: [Post!]!
    getPost(postId: ID!): Post!
    getUsers(filter: String): [User!]!
  }
  type Mutation {
    login(username: String!, password: String!): AuthData!
    register(registerInput: RegisterInput): AuthData!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    updatePost(postId: ID!, body: String!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post! # this is toggle
  }
`;

module.exports = typeDefs;
