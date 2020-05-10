// Library
import { AuthenticationError } from 'apollo-server';

// Domains
import { RoomDetail } from '@server/domains/room/RoomDetail';
import { RoomRepository } from '@server/domains/room/RoomRepository';
import { SessionData } from '@server/domains/auth/SessionData';

export interface OwnerService {
	createRoom: (sessionData: SessionData) => Promise<RoomDetail>;
}

export class OwnerServiceImpl implements OwnerService {
	constructor(
		private readonly roomRepository: RoomRepository,
	) {}

	createRoom = async (sessionData: SessionData): Promise<RoomDetail> => {
		if (!sessionData.authenticatorId) {
			throw new AuthenticationError('token is invalid');
		}
		if (!sessionData.user) {
			throw new AuthenticationError('You need to sign up before continuing');
		}

		const room = RoomDetail.create({ participants: [sessionData.user], room: { name: 'Test Room' } });

		await this.roomRepository.createRoom(room);

		return room;
	}
}
