
import { Room, RoomEntity } from '@server/domains/room/Room';

import { MongoParticipant } from '@server/infrastractures/room/models/MongoParticipant';

export interface MongoRoom {
    readonly id: string;
	readonly invitationCode: string;
	readonly playerCount: number;
	readonly participants: MongoParticipant[];
	readonly createdAt: number;
	readonly deletedAt: number | null;
}

export namespace MongoRoom {
    export function toRoom(mongoRoom: MongoRoom): Room {
        return Room.create({
			invitationCode: mongoRoom.invitationCode,
			playerCount: mongoRoom.playerCount,
			participants: mongoRoom.participants ? mongoRoom.participants.map((participant) => MongoParticipant.toParticipant(participant)) : [],
			createdAt: mongoRoom.createdAt,
		}, mongoRoom.id);
    }

    export function fromRoom(room: RoomEntity): MongoRoom {
        return {
			id: room.id.value,
			invitationCode: room.invitationCode.value,
			playerCount: room.playerCount.value,
			participants: room.participants.map((participant) => MongoParticipant.fromParticipant(participant)),
			createdAt: room.createdAt.value,
			deletedAt: null,
        };
    }
}
