
import { RoomDetail, RoomDetailEntity } from '@server/domains/room/RoomDetail';

import { MongoParticipant } from '@server/infrastractures/room/models/MongoParticipant';

export interface MongoRoomDetail {
    readonly room: {
		id: string;
		name: string;
	};
	readonly invitationCode: string;
	readonly playerCount: number;
	readonly participants: MongoParticipant[];
	readonly createdAt: number;
	readonly deletedAt: number | null;
}

export namespace MongoRoomDetail {
    export function toRoomDetail(mongoRoom: MongoRoomDetail): RoomDetail {
        return RoomDetail.create({
			room: {
				id: mongoRoom.room.id,
				name: mongoRoom.room.name,
			},
			invitationCode: mongoRoom.invitationCode,
			playerCount: mongoRoom.playerCount,
			participants: mongoRoom.participants ? mongoRoom.participants.map((participant) => MongoParticipant.toParticipant(participant)) : [],
			createdAt: mongoRoom.createdAt,
		});
    }

    export function fromRoomDetail(roomDetail: RoomDetailEntity): MongoRoomDetail {
        return {
			room: {
				id: roomDetail.room.id.value,
				name: roomDetail.room.name.value,
			},
			invitationCode: roomDetail.invitationCode.value,
			playerCount: roomDetail.playerCount.value,
			participants: roomDetail.participants.map((participant) => MongoParticipant.fromParticipant(participant)),
			createdAt: roomDetail.createdAt.value,
			deletedAt: null,
        };
    }
}
