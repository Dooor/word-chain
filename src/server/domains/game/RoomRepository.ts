import { RoomEntity, Room } from "./Room";
import { UserEntity as PlayerEntity } from '@server/domains/user/User';

import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/game/InvitationCode';

export interface GetRoomOptions {
	id?: UniqueEntityID;
	invitationCode?: InvitationCode;
}
export interface GetPlayerOptions {
	roomId: UniqueEntityID;
	playerId: UniqueEntityID;
}

export interface RoomRepository {
	getRoom: (options: GetRoomOptions) => Promise<Room | null>;
	createRoom: (room: RoomEntity) => Promise<void>;
	getPlayer: (options: GetPlayerOptions) => Promise<PlayerEntity | null>;
	addPlayer: (room: RoomEntity, player: PlayerEntity) => Promise<void>;
}
