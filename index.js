const { ApolloServer, PubSub } = require("apollo-server");

const mongoose = require("mongoose");
// JHDBdndcN1jm7FHI
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("mongodb connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`server running at ${res.url}`);
  });
