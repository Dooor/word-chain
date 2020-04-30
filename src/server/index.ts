import 'module-alias/register';

import { ApolloServer } from 'apollo-server';

import { typeDefs } from '@server/graphql/schema';
import resolvers from '@server/graphql/resolvers';
import context from '@server/graphql/context';
import { RoomAPIImpl } from '@server/datasources/game';
import { UserAPIImpl } from './datasources/user';

const server = new ApolloServer({
	context,
	typeDefs,
	resolvers,
	dataSources: () => ({
		roomAPI: new RoomAPIImpl(),
		userAPI: new UserAPIImpl(),
	}),
});

server.listen({ port: Number(process.env.PORT) || 4000 }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
