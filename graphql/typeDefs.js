const { gql } = require("apollo-server");

const typeDefs = gql`
  type Reaction {
    id: ID!
    content: String!
    message: Message!
    user: User!
    createdAt: String!
  }
  type Message {
    id: ID!
    content: String!
    to: String!
    from: String!
    createdAt: String!
    reactions: [Reaction]
  }
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
    name: String
  }
  type Notification {
    id: ID!
    read: Boolean!
    verb: String!
    link: String!
    username: String!
    name: String!
    createdAt: String!
    message: String
  }
  type User {
    id: ID!
    username: String!
    name: String!
    email: String!
    posts: [Post!]!
    createdAt: String!
    postsCount: Int!
    unreadNotifications: Int!
    notifications: [Notification!]
    bio: String
    profile_pic: String
    background_pic: String
    website: String
    location: String
    dob: String
    lastMessage: Message
  }
  type AuthData {
    id: ID!
    name: String!
    username: String!
    profile_pic: String
    token: String!
    tokenExpiration: Int!
    unreadNotifications: Int!
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
    login(username: String!, password: String!): AuthData!

    getMessages(from: String!): [Message!]!
    getNotifications: [Notification!]!
  }
  type Mutation {
    register(registerInput: RegisterInput): AuthData!
    createPost(body: String!, mentionedUsers: [String!]): Post!
    deletePost(postId: ID!): String!
    updatePost(postId: ID!, body: String!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post! # this is toggle
    updateUser(userInput: UserInput!): User!

    sendMessage(to: String!, content: String!): Message!
    reactToMessage(messageId: ID!, content: String!): Reaction!
    markNotificationsRead(notificationsIds: [ID!]!): String!
  }
  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;

module.exports = typeDefs;
