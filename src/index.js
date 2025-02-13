require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./schema/message");
const resolvers = require("./resolvers/message");
const cors = require("cors");

const app = express();
app.use(cors());

const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

// WebSocket setup for real-time chat
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
useServer({ schema }, wsServer);

const server = new ApolloServer({ schema });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(4000, () => {
    console.log("🚀 Server running at http://localhost:4000/graphql");
    console.log("⚡ WebSocket active at ws://localhost:4000/graphql");
  });
}

startServer();
