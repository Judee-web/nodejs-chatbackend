const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Message {
    id: ID!
    senderId: String!
    content: String!
    timestamp: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    token: String
  }


  type Query {
    messages: [Message]
    users: [User!]!
  }

  type Mutation {
    sendMessage(senderId: String!, content: String!): Message
    createUser(username: String!, email: String!, password: String!): User!
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): User!
  }

  type Subscription {
    messageSent: Message
  }
`;

module.exports = typeDefs;
