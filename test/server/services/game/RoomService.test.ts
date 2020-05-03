import { RoomServiceImpl } from '../../../../src/server/services/game/RoomService';

import { RoomRepository } from '../../../../src/server/domains/game/RoomRepository';
import { Room, RoomEntity } from '../../../../src/server/domains/game/Room';
import { InvitationCode } from '../../../../src/server/domains/game/InvitationCode';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';
import { User } from '../../../../src/server/domains/user/User';
import { AuthenticatorID } from '../../../../src/server/domains/auth/AuthenticatorID';


describe('RoomServiceImpl', () => {
	describe('#joinPlayer', () => {
		const user = User.create({ name: 'Tester' });
		const authenticatorId = AuthenticatorID.create({ value: SecureRandom.uuid() });
		const sessionData = {
			token: null,
			authenticatorId,
			user,
		};

		const invitationCode = InvitationCode.create({ value: '123456' });
		const room: RoomEntity = Room.create({ invitationCode: '123456' });

		let roomRepository: RoomRepository;

		beforeEach(() => {
			roomRepository = {
				getRoom: jest.fn().mockReturnValue(room),
				createRoom: jest.fn().mockReturnThis(),
				getPlayer: jest.fn().mockReturnValue(null),
				addPlayer: jest.fn().mockReturnThis(),
				removePlayer: jest.fn().mockReturnThis(),
			};
		});

		it('正常系', async () => {
			const expected: RoomEntity = Room.create({ invitationCode: '123456', players: [sessionData.user] }, room.id.value);

			const roomService = new RoomServiceImpl(roomRepository);
			const result = await roomService.joinPlayer(invitationCode, sessionData);

			expect(expected.isEqualTo(result)).toBeTruthy;
		});

		it('部屋が存在しない場合', async () => {
			roomRepository.getRoom = jest.fn().mockReturnValue(null);
			const roomService = new RoomServiceImpl(roomRepository);

			await expect(roomService.joinPlayer(invitationCode, sessionData)).rejects.toThrowError();
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			const mockSessionData = Object.assign(sessionData, { authenticatorId: null });

			await expect(roomService.joinPlayer(invitationCode, mockSessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			const mockSessionData = Object.assign(sessionData, { user: null });

			await expect(roomService.joinPlayer(invitationCode, mockSessionData)).rejects.toThrowError();
		});
	});

	describe('#exitPlayer', () => {
		const user = User.create({ name: 'Tester' });
		const authenticatorId = AuthenticatorID.create({ value: SecureRandom.uuid() });
		const sessionData = {
			token: null,
			authenticatorId,
			user,
		};

		const room: RoomEntity = Room.create({ invitationCode: '123456' });

		let roomRepository: RoomRepository;

		beforeEach(() => {
			roomRepository = {
				getRoom: jest.fn().mockReturnValue(room),
				createRoom: jest.fn().mockReturnThis(),
				getPlayer: jest.fn().mockReturnValue(null),
				addPlayer: jest.fn().mockReturnThis(),
				removePlayer: jest.fn().mockReturnThis(),
			};
		});

		it('正常系', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			await roomService.exitPlayer(room.id, sessionData);

			expect(roomRepository.removePlayer).toHaveBeenCalled;
		});

		it('部屋が存在しない場合', async () => {
			roomRepository.getRoom = jest.fn().mockReturnValue(null);
			const roomService = new RoomServiceImpl(roomRepository);

			await expect(roomService.exitPlayer(room.id, sessionData)).rejects.toThrowError();
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			const mockSessionData = Object.assign(sessionData, { authenticatorId: null });

			await expect(roomService.exitPlayer(room.id, mockSessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			const mockSessionData = Object.assign(sessionData, { user: null });

			await expect(roomService.exitPlayer(room.id, mockSessionData)).rejects.toThrowError();
		});
	});
});
