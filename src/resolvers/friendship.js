const { PubSub } = require("graphql-subscriptions");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const pubsub = new PubSub();
const FRIEND_REQUEST_RECEIVED = "FRIEND_REQUEST_RECEIVED";

const resolvers = {
  Query: {
    friends: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await prisma.friendship.findMany({
        where: { userId: user.userId, status: "ACCEPTED" },
        include: { friend: true },
      }).then(friends => friends.map(f => f.friend));
    },
    pendingRequests: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await prisma.friendship.findMany({
        where: { friendId: user.userId, status: "PENDING" },
        include: { user: true },
      });
    },
  },

  Mutation: {
    sendFriendRequest: async (_, { friendId }, { user }) => {
      if (!user) throw new Error("Authentication required");

      const existingRequest = await prisma.friendship.findFirst({
        where: { userId: user.userId, friendId },
      });

      if (existingRequest) throw new Error("Friend request already sent");

      const request = await prisma.friendship.create({
        data: {
          userId: user.userId,
          friendId,
          status: "PENDING",
        },
        include: { user: true, friend: true },
      });

      pubsub.publish(FRIEND_REQUEST_RECEIVED, { friendRequestReceived: request });
      return request;
    },

    acceptFriendRequest: async (_, { requestId }, { user }) => {
      if (!user) throw new Error("Authentication required");

      const request = await prisma.friendship.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
        include: { user: true, friend: true },
      });

      return request;
    },

    rejectFriendRequest: async (_, { requestId }, { user }) => {
      if (!user) throw new Error("Authentication required");

      await prisma.friendship.delete({ where: { id: requestId } });
      return true;
    },

    removeFriend: async (_, { friendId }, { user }) => {
      if (!user) throw new Error("Authentication required");

      await prisma.friendship.deleteMany({
        where: { OR: [{ userId: user.userId, friendId }, { userId: friendId, friendId: user.userId }] },
      });

      return true;
    },
  },

  Subscription: {
    friendRequestReceived: {
      subscribe: (_, __, { user }) => {
        if (!user) throw new Error("Authentication required");
        return pubsub.asyncIterator(FRIEND_REQUEST_RECEIVED);
      },
    },
  },
};

module.exports = resolvers;
