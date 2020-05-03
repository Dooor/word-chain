import { RoomAPI } from '@server/datasources/game';
import { UserAPI } from '@server/datasources/user';

import {
	QueryRoomArgs,
	MutationJoinRoomArgs,
	MutationExitRoomArgs,
} from '@server/graphql/types';

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
		joinRoom: async (_, { invitationCode }: MutationJoinRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.joinRoom(toParameter(invitationCode)),
		exitRoom: async (_, { roomId }: MutationExitRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.exitRoom(toParameter(roomId)),
		createUser: async (_, __, { dataSources }: { dataSources: DataSources }) =>
			dataSources.userAPI.createUser(),
	}
};
