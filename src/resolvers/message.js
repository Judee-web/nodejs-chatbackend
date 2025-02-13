const { PubSub } = require("graphql-subscriptions");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const pubsub = new PubSub();
const MESSAGE_SENT = "MESSAGE_SENT";

const resolvers = {
    Query: {
        messages: async (_, __, { user }) => {
          if (!user) throw new Error("Authentication required");
      
          return await prisma.message.findMany({
            where: { senderId: user.userId },  // Fetch only messages sent by the user
            orderBy: { timestamp: "desc" },
          });
        },
      },
      
  Mutation: {
    sendMessage: async (_, { senderId, content }) => {
        if (!user) throw new Error("Authentication required");

        const newMessage = await prisma.message.create({
          data: {
            senderId: user.userId,  // Use authenticated user ID
            content,
          },
        });
    
      pubsub.publish(MESSAGE_SENT, { messageSent: newMessage });
      return newMessage;
    },
    createUser: async (_, { username, email, password }) => { // ✅ Add createUser
      return await prisma.user.create({
        data: { username, email, password },
      });
    },
  },
  Subscription: {
    messageSent: {
      subscribe: (_, __, { user }) => {
        if (!user) throw new Error("Authentication required");
  
        return pubsub.asyncIterator(MESSAGE_SENT);
      },
    },
  },
  
};

module.exports = resolvers;
