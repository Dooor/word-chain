
import { Room, RoomEntity } from '@server/domains/room/Room';

import { MongoPlayer } from '@server/infrastractures/room/models/MongoPlayer';

export interface MongoRoom {
    readonly id: string;
	readonly invitationCode: string;
	readonly playerCount: number;
	readonly players: MongoPlayer[];
	readonly createdAt: number;
	readonly deletedAt: number | null;
}

export namespace MongoRoom {
    export function toRoom(mongoRoom: MongoRoom): Room {
        return Room.create({
			invitationCode: mongoRoom.invitationCode,
			playerCount: mongoRoom.playerCount,
			players: mongoRoom.players ? mongoRoom.players.map((player) => MongoPlayer.toPlayer(player)) : [],
			createdAt: mongoRoom.createdAt,
		}, mongoRoom.id);
    }

    export function fromRoom(room: RoomEntity): MongoRoom {
        return {
			id: room.id.value,
			invitationCode: room.invitationCode.value,
			playerCount: room.playerCount.value,
			players: room.players.map((player) => MongoPlayer.fromPlayer(player)),
			createdAt: room.createdAt.value,
			deletedAt: null,
        };
    }
}
