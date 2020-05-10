import { RoomServiceImpl } from '../../../../src/server/services/room/RoomService';

import { RoomRepository } from '../../../../src/server/domains/room/RoomRepository';
import { Room, RoomEntity } from '../../../../src/server/domains/room/Room';
import { InvitationCode } from '../../../../src/server/domains/room/InvitationCode';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';
import { User } from '../../../../src/server/domains/user/User';
import { AuthenticatorID } from '../../../../src/server/domains/auth/AuthenticatorID';
import { SessionData } from '../../../../src/server/domains/auth/SessionData';


describe('RoomServiceImpl', () => {
	const user = User.create({ name: 'Tester' });
	const authenticatorId = AuthenticatorID.create({ value: SecureRandom.uuid() });

	let sessionData: SessionData;
	let roomRepository: RoomRepository;

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
	});

	describe('#createRoom', () => {
		it('正常系', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			await roomService.createRoom(sessionData);

			expect(roomRepository.createRoom).toHaveBeenCalled;
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			sessionData.authenticatorId = null;

			await expect(roomService.createRoom(sessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			sessionData.user = null;

			await expect(roomService.createRoom(sessionData)).rejects.toThrowError();
		});
	});

	describe('#joinParticipant', () => {
		const invitationCode = InvitationCode.create({ value: '123456' });
		const room: RoomEntity = Room.create({ invitationCode: '123456' });

		it('正常系', async () => {
			const expected: RoomEntity = Room.create({ invitationCode: '123456', participants: [sessionData.user!] }, room.id.value);
			roomRepository.getRoom = jest.fn().mockReturnValue(room);

			const roomService = new RoomServiceImpl(roomRepository);
			const result = await roomService.joinParticipant(invitationCode, sessionData);

			expect(expected.isEqualTo(result)).toBeTruthy();
		});

		it('部屋が存在しない場合', async () => {
			roomRepository.getRoom = jest.fn().mockReturnValue(null);
			const roomService = new RoomServiceImpl(roomRepository);

			await expect(roomService.joinParticipant(invitationCode, sessionData)).rejects.toThrowError();
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			sessionData.authenticatorId = null;

			await expect(roomService.joinParticipant(invitationCode, sessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			sessionData.user = null;

			await expect(roomService.joinParticipant(invitationCode, sessionData)).rejects.toThrowError();
		});
	});

	describe('#exitParticipant', () => {
		const room: RoomEntity = Room.create({ invitationCode: '123456' });

		it('正常系', async () => {
			roomRepository.getRoom = jest.fn().mockReturnValue(room);
			const roomService = new RoomServiceImpl(roomRepository);
			await roomService.exitParticipant(room.id, sessionData);

			expect(roomRepository.removeParticipant).toHaveBeenCalled;
		});

		it('部屋が存在しない場合', async () => {
			roomRepository.getRoom = jest.fn().mockReturnValue(null);
			const roomService = new RoomServiceImpl(roomRepository);

			await expect(roomService.exitParticipant(room.id, sessionData)).rejects.toThrowError();
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			sessionData.authenticatorId = null;

			await expect(roomService.exitParticipant(room.id, sessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const roomService = new RoomServiceImpl(roomRepository);
			sessionData.user = null;

			await expect(roomService.exitParticipant(room.id, sessionData)).rejects.toThrowError();
		});
	});
});
