require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const typeDefs = require("./schema/message");
const messageResolvers = require("./resolvers/message");
const authResolvers = require("./resolvers/auth");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Store in .env

const app = express();
app.use(cors());

// Create HTTP & WebSocket Server
const httpServer = createServer(app);
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [messageResolvers, authResolvers], // ✅ Merge resolvers
});

// WebSocket setup for real-time chat
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
useServer({ schema }, wsServer);

// Apollo Server with context for auth
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    let user = null;

    if (token) {
      try {
        user = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
      } catch (error) {
        console.warn("Invalid token");
      }
    }

    return { user };
  },
});

// Start Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(4000, () => {
    console.log("🚀 Server running at http://localhost:4000/graphql");
    console.log("⚡ WebSocket active at ws://localhost:4000/graphql");
  });
}

startServer();
