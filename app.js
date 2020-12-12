const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;

const resolvers = {
  Query: {
    sayHi: () => "Hello Chhavi!",
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const PORT = process.env.PORT || 1930;

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
