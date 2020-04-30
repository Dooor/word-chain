
import { Room, RoomEntity } from '@server/domains/game/Room';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/game/InvitationCode';
import { PlayerCount } from '@server/domains/game/PlayerCount';

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
			invitationCode: InvitationCode.create({ value: mongoRoom.invitationCode }),
			playerCount: PlayerCount.create({ value: mongoRoom.playerCount }),
			createdAt: DateTime.create({ value: mongoRoom.createdAt }),
		}, UniqueEntityID.create({ value: mongoRoom.id }));
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
