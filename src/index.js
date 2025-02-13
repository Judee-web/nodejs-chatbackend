const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const cors = require("cors");

const typeDefs = require("./schema/message");
const messageResolvers = require("./resolvers/message");
const friendshipResolvers = require("./resolvers/friendship");

const app = express();
app.use(cors());

const httpServer = createServer(app);
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [messageResolvers, friendshipResolvers],
});

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
