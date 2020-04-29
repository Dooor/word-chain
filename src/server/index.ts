import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/schema';

const server = new ApolloServer({ typeDefs });

server.listen({ port: Number(process.env.PORT) || 4000 }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
