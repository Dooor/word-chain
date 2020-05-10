// Library
import { AuthenticationError, ForbiddenError } from 'apollo-server';

// Room
import { RoomDetail } from '@server/domains/room/RoomDetail';
import { RoomRepository } from '@server/domains/room/RoomRepository';
import { SessionData } from '@server/domains/auth/SessionData';
import { RoomName } from '@server/domains/room/Room/Name';
import { Capacity } from '@server/domains/room/RoomDetail/Capacity';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

// Game
import { Game } from '@server/domains/game/Game';
import { Player } from '@server/domains/game/Player';
import { GameRepository } from '@server/domains/game/GameRepository';

export interface OwnerService {
	createRoom: (name: RoomName, capacity: Capacity, sessionData: SessionData) => Promise<RoomDetail>;
	createGame: (roomId: UniqueEntityID, sessionData: SessionData) => Promise<Game>;
}

export class OwnerServiceImpl implements OwnerService {
	constructor(
		private readonly roomRepository: RoomRepository,
		private readonly gameRepository: GameRepository,
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

	createGame = async (roomId: UniqueEntityID, sessionData: SessionData): Promise<Game> => {
		if (!sessionData.authenticatorId) {
			throw new AuthenticationError('token is invalid');
		}
		if (!sessionData.user) {
			throw new AuthenticationError('You need to sign up before continuing');
		}

		const roomDetail = await this.roomRepository.getRoom({ id: roomId });
		if(!roomDetail) {
			throw new ForbiddenError(`Not found Room by ID: ${ roomId.value }`);
		}

		const game = Game.create({
			room: {
				id: roomDetail.room.id.value,
				name: roomDetail.room.name.value
			},
			players: roomDetail.participants.map((participant, index) => Player.create({
				turn: index + 1,
				user: {
					id: participant.id.value,
					name: participant.name.value,
				}
			}))
		});

		await this.gameRepository.createGame(game);

		return game;
	}
}
