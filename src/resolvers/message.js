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
        where: { senderId: user.userId },
        orderBy: { timestamp: "desc" },
      });
    },
  },

  Mutation: {
    sendMessage: async (_, { senderId, content }, { user }) => {
      if (!user) throw new Error("Authentication required");

      const newMessage = await prisma.message.create({
        data: {
          senderId: user.userId,
          content,
        },
      });

      pubsub.publish(MESSAGE_SENT, { messageSent: newMessage });
      return newMessage;
    },

    editMessage: async (_, { id, content }, { user }) => {
      if (!user) throw new Error("Authentication required");

      const message = await prisma.message.findUnique({ where: { id } });
      if (!message || message.senderId !== user.userId) {
        throw new Error("Unauthorized");
      }

      return await prisma.message.update({
        where: { id },
        data: { content },
      });
    },

    deleteMessage: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");

      const message = await prisma.message.findUnique({ where: { id } });
      if (!message || message.senderId !== user.userId) {
        throw new Error("Unauthorized");
      }

      await prisma.message.delete({ where: { id } });
      return true;
    },

    addReaction: async (_, { messageId, reaction }, { user }) => {
      if (!user) throw new Error("Authentication required");

      return await prisma.message.update({
        where: { id: messageId },
        data: { reactions: { push: reaction } },
      });
    },

    createUser: async (_, { username, email, password }) => {
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
