const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Message {
    id: ID!
    sender: String!
    content: String!
    timestamp: String!
  }

  type Query {
    messages: [Message]
  }

  type Mutation {
    sendMessage(sender: String!, content: String!): Message
  }

  type Subscription {
    messageSent: Message
  }
`;

module.exports = typeDefs;
