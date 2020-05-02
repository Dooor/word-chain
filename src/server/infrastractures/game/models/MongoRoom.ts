
import { Room, RoomEntity } from '@server/domains/game/Room';

export interface MongoRoom {
    readonly id: string;
	readonly invitationCode: string;
	readonly playerCount: number;
	readonly createdAt: number;
	readonly deletedAt: number | null;
}

export namespace MongoRoom {
    export function toRoom(mongoRoom: MongoRoom): RoomEntity {
        return Room.create({
			invitationCode: mongoRoom.invitationCode,
			playerCount: mongoRoom.playerCount,
			createdAt: mongoRoom.createdAt,
		}, mongoRoom.id);
    }

    export function fromRoom(room: RoomEntity): MongoRoom {
        return {
			id: room.id.value,
			invitationCode: room.invitationCode.value,
			playerCount: room.playerCount.value,
			createdAt: room.createdAt.value,
			deletedAt: null,
        };
    }
}
