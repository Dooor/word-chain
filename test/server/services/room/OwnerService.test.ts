import { OwnerServiceImpl } from '../../../../src/server/services/room/OwnerService';

import { RoomRepository } from '../../../../src/server/domains/room/RoomRepository';
import { GameRepository } from '../../../../src/server/domains/game/GameRepository';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';

// User
import { User } from '../../../../src/server/domains/user/User';

// Auth
import { AuthenticatorID } from '../../../../src/server/domains/auth/AuthenticatorID';
import { SessionData } from '../../../../src/server/domains/auth/SessionData';

// Room
import { RoomDetail } from '../../../../src/server/domains/room/RoomDetail';
import { RoomName } from '../../../../src/server/domains/room/Room/Name';
import { Capacity } from '../../../../src/server/domains/room/RoomDetail/Capacity';

// Core
import { UniqueEntityID } from '../../../../src/server/domains/core/UniqueEntityID';

describe('OwnerServiceImpl', () => {
	const user = User.create({ name: 'Tester' });
	const authenticatorId = AuthenticatorID.create({ value: SecureRandom.uuid() });
	const roomName = RoomName.create({ value: 'Test_Room' });
	const capacity = Capacity.create({ value: 2 });

	let sessionData: SessionData;
	let roomRepository: RoomRepository;
	let gameRepository: GameRepository;

	beforeEach(() => {
		sessionData = {
			token: null,
			authenticatorId,
			user,
		};
		roomRepository = {
			getRoom: jest.fn().mockReturnValue(null),
			createRoom: jest.fn().mockReturnThis(),
			getParticipant: jest.fn().mockReturnValue(null),
			addParticipant: jest.fn().mockReturnThis(),
			removeParticipant: jest.fn().mockReturnThis(),
		};
		gameRepository = {
			getGame: jest.fn().mockReturnValue(null),
			createGame: jest.fn().mockReturnValue(null),
			addQuestion: jest.fn().mockReturnValue(null),
		};
	});

	describe('#createRoom', () => {
		it('正常系', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository, gameRepository);
			await ownerService.createRoom(roomName, capacity, sessionData);

			expect(roomRepository.createRoom).toHaveBeenCalled;
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository, gameRepository);
			sessionData.authenticatorId = null;

			await expect(ownerService.createRoom(roomName, capacity, sessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository, gameRepository);
			sessionData.user = null;

			await expect(ownerService.createRoom(roomName, capacity, sessionData)).rejects.toThrowError();
		});
	});

	describe('#createGame', () => {
		const roomId = UniqueEntityID.create();

		it('正常系', async () => {
			const roomDetail = RoomDetail.create({ room: { name: 'Test_Room' }, capacity: 2 });
			roomRepository.getRoom = jest.fn().mockReturnValue(roomDetail);

			const ownerService = new OwnerServiceImpl(roomRepository, gameRepository);
			await ownerService.createGame(roomId, sessionData);

			expect(roomRepository.createRoom).toHaveBeenCalled;
		});

		it('与えられた部屋IDでは部屋が見つからない場合はエラー', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository, gameRepository);
			roomRepository.getRoom = jest.fn().mockReturnValue(null);

			await expect(ownerService.createGame(roomId, sessionData)).rejects.toThrowError();
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository, gameRepository);
			sessionData.authenticatorId = null;

			await expect(ownerService.createGame(roomId, sessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository, gameRepository);
			sessionData.user = null;

			await expect(ownerService.createGame(roomId, sessionData)).rejects.toThrowError();
		});
	});
});
