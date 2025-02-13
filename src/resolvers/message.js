const { PubSub } = require("graphql-subscriptions");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const MESSAGE_SENT = "MESSAGE_SENT";

const resolvers = {
  Query: {
    messages: async () => await prisma.message.findMany(),
  },
  Mutation: {
    sendMessage: async (_, { sender, content }) => {
      const newMessage = await prisma.message.create({
        data: { sender, content },
      });

      pubsub.publish(MESSAGE_SENT, { messageSent: newMessage });
      return newMessage;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_SENT),
    },
  },
};

module.exports = resolvers;
