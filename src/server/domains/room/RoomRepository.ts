import { RoomDetailEntity, RoomDetail } from "./RoomDetail";
import { UserEntity as ParticipantEntity } from '@server/domains/user/User';

import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/room/RoomDetail/InvitationCode';

export interface GetRoomOptions {
	id?: UniqueEntityID;
	invitationCode?: InvitationCode;
}
export interface GetParticipantOptions {
	roomId: UniqueEntityID;
	playerId: UniqueEntityID;
}

export interface RoomRepository {
	getRoom: (options: GetRoomOptions) => Promise<RoomDetail | null>;
	createRoom: (room: RoomDetailEntity) => Promise<void>;
	getParticipant: (options: GetParticipantOptions) => Promise<ParticipantEntity | null>;
	addParticipant: (room: RoomDetailEntity, participant: ParticipantEntity) => Promise<void>;
	removeParticipant: (room: RoomDetailEntity, participant: ParticipantEntity) => Promise<void>;
}
