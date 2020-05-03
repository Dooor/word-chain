// Library
import { AuthenticationError, ForbiddenError } from 'apollo-server';

// Domains
import { Room } from '@server/domains/game/Room';
import { InvitationCode } from '@server/domains/game/InvitationCode';
import { RoomRepository } from '@server/domains/game/RoomRepository';
import { SessionData } from '@server/domains/auth/SessionData';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

export interface RoomService {
	joinPlayer: (invitationCode: InvitationCode, sessionData: SessionData) => Promise<Room>;
	exitPlayer: (roomId: UniqueEntityID, sessionData: SessionData) => Promise<Room>;
}

export class RoomServiceImpl implements RoomService {
	constructor(
		private readonly roomRepository: RoomRepository,
	) {}

	joinPlayer = async (invitationCode: InvitationCode, sessionData: SessionData): Promise<Room> => {
		if (!sessionData.authenticatorId) {
			throw new AuthenticationError('token is invalid');
		}
		if (!sessionData.user) {
			throw new AuthenticationError('You need to sign up before continuing');
		}

		const room = await this.roomRepository.getRoom({ invitationCode });
		if (!room) {
			throw new ForbiddenError(`Not found room by invitation code: ${ invitationCode.value }`);
		}

		await this.roomRepository.addPlayer(room, sessionData.user);

		room.players.push(sessionData.user);

		return room;
	}

	exitPlayer = async (roomId: UniqueEntityID, sessionData: SessionData): Promise<Room> => {
		if (!sessionData.authenticatorId) {
			throw new AuthenticationError('token is invalid');
		}
		if (!sessionData.user) {
			throw new AuthenticationError('You need to sign up before continuing');
		}

		const room = await this.roomRepository.getRoom({ id: roomId });
		if (!room) {
			throw new ForbiddenError(`Not found room by id: ${ roomId.value }`);
		}

		await this.roomRepository.removePlayer(room, sessionData.user);

		return Room.create({
			invitationCode: room.invitationCode.value,
			playerCount: room.playerCount.value,
			createdAt: room.createdAt.value,
		}, room.id.value);
	}
}
