
import { RoomEntity } from '@server/domains/game/RoomEntity';
import { UnixTimestamp } from '@server/utils/UnixTimestamp';

export interface MongoRoom {
    readonly id: string;
	readonly invitationCode: string;
	readonly playerCount: number;
	readonly createdAt: number;
	readonly deletedAt: number | null;
}

export namespace MongoRoom {
    export function toRoom(mongoRoom: MongoRoom): RoomEntity {
        return {
			id: mongoRoom.id,
			invitationCode: mongoRoom.invitationCode,
			playerCount: mongoRoom.playerCount,
			createdAt: mongoRoom.createdAt,
		};
    }

    export function fromRoom(room: RoomEntity): MongoRoom {
        return {
			id: room.id,
			invitationCode: room.invitationCode,
			playerCount: room.playerCount,
			createdAt: room.createdAt || UnixTimestamp.now(),
			deletedAt: null,
        };
    }
}
