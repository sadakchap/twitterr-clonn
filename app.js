const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log(`🥳 DB CONNECTED AT ${conn.connection.port}`);
    const PORT = process.env.PORT || 1930;
    server.listen(PORT).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("DB CONNECTION FAILED 🤡🤡");
    // process.exit(1);
  });
