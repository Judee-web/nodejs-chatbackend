# GraphQL Real-Time Chat App (Node.js, Express, PostgreSQL, Prisma, GraphQL, WebSockets)

## 🚀 Project Overview
This is a **real-time chat application backend** built using **GraphQL, Apollo Server, Express, PostgreSQL, Prisma ORM, and WebSockets** for real-time messaging.

## 🏗️ Project Structure
```
/graphql-chat-backend
│── src/
│   ├── schema/
│   │   ├── message.js    # GraphQL Type Definitions
│   ├── resolvers/
│   │   ├── message.js    # Message Resolvers
│   │   ├── auth.js       # Authentication Logic
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT Authentication Middleware
│   ├── utils/
│   │   ├── jwt.js        # JWT Helper Functions
│   ├── prisma/
│   │   ├── schema.prisma # Prisma Database Schema
│   ├── index.js          # Server Entry Point
│── .env                  # Environment Variables
│── package.json          # Dependencies
│── prisma/migrations/    # Prisma Migrations
```

## 📦 Installation

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-repo/graphql-chat-backend.git
cd graphql-chat-backend
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Configure Environment Variables**
Create a `.env` file in the root directory:
```plaintext
DATABASE_URL=postgresql://user:password@localhost:5432/chatdb
JWT_SECRET=your_secure_jwt_secret
PORT=4000
```

### **4️⃣ Set Up Database**
Make sure you have **PostgreSQL installed and running**. Then, run:
```sh
npx prisma migrate dev --name init
npx prisma generate
```
This initializes the database with required tables.

### **5️⃣ Start the Server**
```sh
npm start
```
Your GraphQL API is now running at:  
🌍 **http://localhost:4000/graphql**  
⚡ **WebSockets active at ws://localhost:4000/graphql**

---

## 🔥 Features Implemented
- **User Authentication (JWT)**
- **Real-time Messaging with WebSockets**
- **GraphQL Queries, Mutations, and Subscriptions**
- **Prisma ORM for Database Management**
- **Express Middleware for Authentication**
- **PostgreSQL Database Integration**

---

## 📜 GraphQL Schema
```graphql
type Message {
  id: ID!
  senderId: String!
  content: String!
  timestamp: String!
}

type User {
  id: ID!
  username: String!
  email: String!
  password: String!
}

type Query {
  messages: [Message]
}

type Mutation {
  createUser(username: String!, email: String!, password: String!): User!
  sendMessage(senderId: String!, content: String!): Message
}

type Subscription {
  messageSent: Message
}
```

---

## 🗄 Database Schema
The database structure using **Prisma ORM**:

```prisma
model User {
  id       String   @id @default(uuid())
  username String   @unique
  email    String   @unique
  password String
  messages Message[]
}

model Message {
  id        String   @id @default(uuid())
  sender    User     @relation(fields: [senderId], references: [id])
  senderId  String
  content   String
  timestamp DateTime @default(now())
}
```

---

## 📡 API Endpoints (GraphQL)

### **1️⃣ Create a User**
```graphql
mutation {
  createUser(username: "Alice", email: "alice@email.com", password: "securepass") {
    id
    username
    email
  }
}
```

### **2️⃣ Authenticate & Get JWT Token**
```graphql
mutation {
  login(email: "alice@email.com", password: "securepass") {
    token
  }
}
```

### **3️⃣ Send a Message**
```graphql
mutation {
  sendMessage(senderId: "user-id", content: "Hello, GraphQL!") {
    id
    content
    timestamp
  }
}
```

### **4️⃣ Get Messages**
```graphql
query {
  messages {
    id
    senderId
    content
    timestamp
  }
}
```

### **5️⃣ Subscribe to New Messages (Real-Time)**
```graphql
subscription {
  messageSent {
    id
    senderId
    content
    timestamp
  }
}
```

---

## 🛠️ Technologies Used
- **Node.js + Express** (Backend)
- **GraphQL + Apollo Server** (API)
- **PostgreSQL** (Database)
- **Prisma ORM** (Database Management)
- **JWT Authentication** (Security)
- **WebSockets (GraphQL Subscriptions)** (Real-Time Communication)
- **Docker** (Optional, for database setup)

---

## 🚀 Next Steps
- ✅ **Complete Authentication** (✔️ Done!)
- ✅ **Setup WebSocket for Real-Time Messages** (✔️ Done!)
- 🔜 **Build Flutter Frontend**
- 🔜 **Improve Message Filtering & Pagination**
- 🔜 **Deploy to Production (Docker, AWS, or Heroku)**

---

## 📜 License
This project is **open-source** and free to use under the MIT License.

---

## 👨‍💻 Contributors
- **Jude** - Backend Developer

For issues, feel free to **open an issue** or **contribute**! 🚀

