// Domains
import { RoomDetailEntity } from '@server/domains/room/RoomDetail';

// Types
import {
	Room as RoomResponse,
} from '@server/graphql/types';

export namespace RoomPresenter {
	export function toResponse(roomDetail: RoomDetailEntity): RoomResponse {
		return {
			id: roomDetail.room.id.value,
			invitationCode: roomDetail.invitationCode.value,
			capacity: roomDetail.capacity.value,
			players: roomDetail.participants.map((participant) => ({
				id: participant.id.value,
				name: participant.name.value,
			})),
		};
	}
}
