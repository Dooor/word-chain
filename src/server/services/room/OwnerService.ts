// Library
import { AuthenticationError } from 'apollo-server';

// Domains
import { RoomDetail } from '@server/domains/room/RoomDetail';
import { RoomRepository } from '@server/domains/room/RoomRepository';
import { SessionData } from '@server/domains/auth/SessionData';
import { RoomName } from '@server/domains/room/Room/Name';
import { Capacity } from '@server/domains/room/RoomDetail/Capacity';

export interface OwnerService {
	createRoom: (name: RoomName, capacity: Capacity, sessionData: SessionData) => Promise<RoomDetail>;
}

export class OwnerServiceImpl implements OwnerService {
	constructor(
		private readonly roomRepository: RoomRepository,
	) {}

	createRoom = async (name: RoomName, capacity: Capacity, sessionData: SessionData): Promise<RoomDetail> => {
		if (!sessionData.authenticatorId) {
			throw new AuthenticationError('token is invalid');
		}
		if (!sessionData.user) {
			throw new AuthenticationError('You need to sign up before continuing');
		}

		const roomDetail = RoomDetail.create({ participants: [sessionData.user], capacity: capacity.value, room: { name: name.value } });

		await this.roomRepository.createRoom(roomDetail);

		return roomDetail;
	}
}
