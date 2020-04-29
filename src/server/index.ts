import 'module-alias/register';

import { ApolloServer } from 'apollo-server';
import { typeDefs } from '@server/graphql/schema';

import resolvers from '@server/graphql/resolvers';

import { RoomAPIImpl } from '@server/datasources/game';

const server = new ApolloServer({
	typeDefs,
	resolvers,
	dataSources: () => ({
		roomAPI: new RoomAPIImpl(),
	}),
});

server.listen({ port: Number(process.env.PORT) || 4000 }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
