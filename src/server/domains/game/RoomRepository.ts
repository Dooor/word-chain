import { RoomEntity, Room } from "./Room";

import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/game/InvitationCode';

export interface GetRoomOptions {
	id?: UniqueEntityID;
	invitationCode?: InvitationCode;
}

export interface RoomRepository {
	getRoom: (options: GetRoomOptions) => Promise<Room | null>;
	createRoom: (room: RoomEntity) => Promise<void>;
}
