import { RoomAPI } from '@server/datasources/game';
import { UserAPI } from '@server/datasources/user';

import { QueryRoomArgs } from '@server/graphql/types';

interface DataSources {
	roomAPI: RoomAPI;
	userAPI: UserAPI;
}

const toParameter = (arg: any): any | undefined => arg || undefined;

export default {
	Query: {
		room: (_, { id, invitationCode }: QueryRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.getRoom(toParameter(id), toParameter(invitationCode)),
	},
	Mutation: {
		createRoom: async (_, __, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.createRoom(),
		createUser: async (_, __, { dataSources }: { dataSources: DataSources }) =>
			dataSources.userAPI.createUser(),
	}
};
