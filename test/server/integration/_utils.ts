import { ApolloServer } from 'apollo-server';

import defaultContext from '../../../src/server/graphql/context';
import resolvers from '../../../src/server/graphql/resolvers';
import { typeDefs } from '../../../src/server/graphql/schema';
import { RoomAPIImpl, RoomAPI } from '../../../src/server/datasources/room';
import { GameAPIImpl, GameAPI } from '../../../src/server/datasources/game';
import { UserAPIImpl, UserAPI } from '../../../src/server/datasources/user';

import { User } from '../../../src/server/domains/user/User';
import { AuthenticatorID } from '../../../src/server/domains/auth/AuthenticatorID';
import { SessionData } from '../../../src/server/domains/auth/SessionData';
import { Token } from '../../../src/server/domains/auth/Token';

interface TestServer {
	server: ApolloServer;
	roomAPI: RoomAPI;
	userAPI: UserAPI;
	gameAPI: GameAPI;
}

export const constructTestServer = ({ context = defaultContext }): TestServer => {
	const roomAPI = new RoomAPIImpl();
	const userAPI = new UserAPIImpl();
	const gameAPI = new GameAPIImpl();

	const server = new ApolloServer({
		context,
		typeDefs,
		resolvers,
		dataSources: () => ({
			roomAPI,
			userAPI,
			gameAPI,
		}),
	});

	return {
		server,
		roomAPI,
		userAPI,
		gameAPI,
	};
};

export const mockSessionData = (): SessionData => ({
	user: User.create({
		name: 'Tester',
	}),
	token: Token.create({ value: 'xxx-token' }),
	authenticatorId: AuthenticatorID.create({ value: 'xxx-authenticator-id' }),
});
export const mockNoUserSessionData = (): SessionData => ({
	user: null,
	token: Token.create({ value: 'xxx-token' }),
	authenticatorId: AuthenticatorID.create({ value: 'xxx-authenticator-id' }),
});
