const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Message {
    id: ID!
    senderId: String!
    content: String!
    timestamp: String!
    reactions: [String!]  # New field for reactions
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    token: String
    friends: [User!]  # New field for friend system
  }

  type Query {
    messages: [Message]
    users: [User!]!
    friends: [User!]!  # Fetch friends list
  }

  type Mutation {
    sendMessage(senderId: String!, content: String!): Message
    editMessage(id: ID!, content: String!): Message!  # New
    deleteMessage(id: ID!): Boolean!  # New
    addReaction(messageId: ID!, reaction: String!): Message!  # New
    
    createUser(username: String!, email: String!, password: String!): User!
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): User!

    addFriend(friendId: ID!): User!  # New
    removeFriend(friendId: ID!): User!  # New
  }

  type Subscription {
    messageSent: Message
    friendRequest: User  # New - for real-time friend system
  }
`;

module.exports = typeDefs;
