const { PubSub } = require("graphql-subscriptions");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const pubsub = new PubSub();
const MESSAGE_SENT = "MESSAGE_SENT";

const resolvers = {
  Query: {
    messages: async () => await prisma.message.findMany(),
    users: async () => await prisma.user.findMany(), // ✅ Add users query
  },
  Mutation: {
    sendMessage: async (_, { senderId, content }) => {
      const newMessage = await prisma.message.create({
        data: {
          senderId,
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
      subscribe: () => pubsub.asyncIterator(MESSAGE_SENT),
    },
  },
};

module.exports = resolvers;
