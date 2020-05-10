// Domains
import { RoomEntity } from '@server/domains/room/Room';

// Types
import {
	Room as RoomResponse,
} from '@server/graphql/types';

export namespace RoomPresenter {
	export function toResponse(room: RoomEntity): RoomResponse {
		return {
			id: room.id.value,
			invitationCode: room.invitationCode.value,
			playerCount: room.playerCount.value,
			players: room.participants.map((participant) => ({
				id: participant.id.value,
				name: participant.name.value,
			})),
		};
	}
}
