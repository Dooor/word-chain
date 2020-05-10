// Library
import { AuthenticationError, ForbiddenError } from 'apollo-server';

// Domains
import { RoomDetail } from '@server/domains/room/RoomDetail';
import { InvitationCode } from '@server/domains/room/RoomDetail/InvitationCode';
import { RoomRepository } from '@server/domains/room/RoomRepository';
import { SessionData } from '@server/domains/auth/SessionData';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

export interface RoomService {
	createRoom: (sessionData: SessionData) => Promise<RoomDetail>;
	joinParticipant: (invitationCode: InvitationCode, sessionData: SessionData) => Promise<RoomDetail>;
	exitParticipant: (roomId: UniqueEntityID, sessionData: SessionData) => Promise<RoomDetail>;
}

export class RoomServiceImpl implements RoomService {
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

	joinParticipant = async (invitationCode: InvitationCode, sessionData: SessionData): Promise<RoomDetail> => {
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

		await this.roomRepository.addParticipant(room, sessionData.user);

		room.participants.push(sessionData.user);

		return room;
	}

	exitParticipant = async (roomId: UniqueEntityID, sessionData: SessionData): Promise<RoomDetail> => {
		if (!sessionData.authenticatorId) {
			throw new AuthenticationError('token is invalid');
		}
		if (!sessionData.user) {
			throw new AuthenticationError('You need to sign up before continuing');
		}

		const roomDetail = await this.roomRepository.getRoom({ id: roomId });
		if (!roomDetail) {
			throw new ForbiddenError(`Not found room by id: ${ roomId.value }`);
		}

		await this.roomRepository.removeParticipant(roomDetail, sessionData.user);

		return RoomDetail.create({
			room: {
				id: roomDetail.room.id.value,
				name: roomDetail.room.name.value,
			},
			invitationCode: roomDetail.invitationCode.value,
			playerCount: roomDetail.playerCount.value,
			createdAt: roomDetail.createdAt.value,
		});
	}
}
