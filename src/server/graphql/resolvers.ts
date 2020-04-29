import { RoomAPI } from '@server/datasources/game';

import { RoomArgument } from '@server/graphql/arguments';

interface DataSources {
	roomAPI: RoomAPI;
}

export default {
	Query: {
		room: (_, { id, invitationCode }: RoomArgument, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.getRoom(id, invitationCode),
	},
	Mutation: {
		createRoom: async (_, __, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.createRoom(),
	}
};
