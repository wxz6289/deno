import { ApolloServer } from "npm:@apollo/server@^4.9";
import { startStandaloneServer } from "npm:@apollo/server@4.9/standalone";
import { graphql } from "npm:graphql@16.8";
import { typeDefs } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

interface MyContext {
  token?: string;
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ token: req.headers.token }),
  listen: { port: 8000 },
});

console.log(`Server running on: ${url}`);