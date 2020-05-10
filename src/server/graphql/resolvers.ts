import { RoomAPI } from '@server/datasources/room';
import { UserAPI } from '@server/datasources/user';
import { GameAPI } from '@server/datasources/game';

import { RoomController } from '@server/presentations/room/RoomController';
import { GameController } from '@server/presentations/game/GameController';

import {
	QueryRoomArgs,
	MutationCreateRoomArgs,
	MutationJoinRoomArgs,
	MutationExitRoomArgs,
	MutationCreateGameArgs,
} from '@server/graphql/types';

interface DataSources {
	gameAPI: GameAPI;
	roomAPI: RoomAPI;
	userAPI: UserAPI;
}

export default {
	Query: {
		room: (_, args: QueryRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.getRoom(RoomController.toGetRoomParameter(args)),
	},
	Mutation: {
		createRoom: async (_, args: MutationCreateRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.createRoom(RoomController.toCreateRoomParameter(args)),
		joinRoom: async (_, args: MutationJoinRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.joinRoom(RoomController.toJoinRoomParameter(args)),
		exitRoom: async (_, args: MutationExitRoomArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.roomAPI.exitRoom(RoomController.toExitRoomParameter(args)),
		createGame: async (_, args: MutationCreateGameArgs, { dataSources }: { dataSources: DataSources }) =>
			dataSources.gameAPI.createGame(GameController.toCreateGameParameter(args)),
		createUser: async (_, __, { dataSources }: { dataSources: DataSources }) =>
			dataSources.userAPI.createUser(),
	}
};
