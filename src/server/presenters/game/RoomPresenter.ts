import { RoomEntity } from '@server/domains/game/Room';
import { Room as RoomResponse } from '@server/graphql/types';

export namespace RoomPresenter {
	export function toResponse(room: RoomEntity): RoomResponse {
		return {
			id: room.id.value,
			invitationCode: room.invitationCode.value,
			playerCount: room.playerCount.value,
		};
	}
}
