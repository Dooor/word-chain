import { RoomAPI } from '@server/datasources/game';
import { UserAPI } from '@server/datasources/user';

import { RoomController } from '@server/presenters/game/RoomController';

import {
	QueryRoomArgs,
	MutationJoinRoomArgs,
	MutationExitRoomArgs,
} from '@server/graphql/types';

interface DataSources {
	roomAPI: RoomAPI;
	userAPI: UserAPI;
}

export default {
	Query: {
		room: (_, args: QueryRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.getRoom(RoomController.toGetRoomParameter(args)),
	},
	Mutation: {
		createRoom: async (_, __, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.createRoom(),
		joinRoom: async (_, args: MutationJoinRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.joinRoom(RoomController.toJoinRoomParameter(args)),
		exitRoom: async (_, args: MutationExitRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.exitRoom(RoomController.toExitRoomParameter(args)),
		createUser: async (_, __, { dataSources }: { dataSources: DataSources }) =>
			dataSources.userAPI.createUser(),
	}
};
