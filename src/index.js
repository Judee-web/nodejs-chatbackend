const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { PubSub } = require("graphql-subscriptions");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const typeDefs = `
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

const resolvers = {
  Query: {
    messages: async () => await prisma.message.findMany(),
  },
  Mutation: {
    sendMessage: async (_, { sender, content }) => {
      const newMessage = await prisma.message.create({
        data: { sender, content },
      });

      pubsub.publish("MESSAGE_SENT", { messageSent: newMessage });
      return newMessage;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: (_, __) => pubsub.asyncIterator("MESSAGE_SENT"),
    },
  },
};

// Create Express App
const app = express();
app.use(cors());

// Create HTTP Server
const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create WebSocket Server
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });

useServer({ schema }, wsServer);

// Start Apollo Server
const server = new ApolloServer({ schema });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(4000, () => {
    console.log("🚀 Server running on http://localhost:4000/graphql");
    console.log("⚡ WebSocket listening on ws://localhost:4000/graphql");
  });
}

startServer();
