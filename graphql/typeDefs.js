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
    posts: [Post!]!
    createdAt: String!
    postsCount: Int!
    bio: String
    profile_pic: String
    background_pic: String
    website: String
    location: String
    dob: String
  }
  type AuthData {
    id: ID!
    name: String!
    username: String!
    profile_pic: String
    token: String!
    tokenExpiration: Int!
  }
  input RegisterInput {
    name: String!
    email: String!
    password: String!
    bio: String
  }
  input UserInput {
    name: String!
    profile_pic: String
    bio: String
    location: String
    website: String
  }
  type Query {
    getPosts: [Post!]!
    getPost(postId: ID!): Post!
    getUsers(filter: String): [User!]!
    getUser(username: String!): User!
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
    updateUser(userInput: UserInput!): User!
  }
`;

module.exports = typeDefs;
