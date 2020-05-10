import { RoomEntity, Room } from "./Room";
import { UserEntity as ParticipantEntity } from '@server/domains/user/User';

import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/room/InvitationCode';

export interface GetRoomOptions {
	id?: UniqueEntityID;
	invitationCode?: InvitationCode;
}
export interface GetParticipantOptions {
	roomId: UniqueEntityID;
	playerId: UniqueEntityID;
}

export interface RoomRepository {
	getRoom: (options: GetRoomOptions) => Promise<Room | null>;
	createRoom: (room: RoomEntity) => Promise<void>;
	getParticipant: (options: GetParticipantOptions) => Promise<ParticipantEntity | null>;
	addParticipant: (room: RoomEntity, participant: ParticipantEntity) => Promise<void>;
	removeParticipant: (room: RoomEntity, participant: ParticipantEntity) => Promise<void>;
}
