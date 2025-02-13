const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Make sure to store this in .env

const authResolvers = {
  Mutation: {
    register: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "7d",
      });

      return { ...user, token }; // ✅ Return token
    },

    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Invalid password");

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "7d",
      });

      return { ...user, token }; // ✅ Return token
    },
  },
};

module.exports = authResolvers;
