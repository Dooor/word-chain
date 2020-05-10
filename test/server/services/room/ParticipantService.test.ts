import { ParticipantServiceImpl } from '../../../../src/server/services/room/ParticipantService';

import { RoomRepository } from '../../../../src/server/domains/room/RoomRepository';
import { RoomDetail, RoomDetailEntity } from '../../../../src/server/domains/room/RoomDetail';
import { InvitationCode } from '../../../../src/server/domains/room/RoomDetail/InvitationCode';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';
import { User } from '../../../../src/server/domains/user/User';
import { AuthenticatorID } from '../../../../src/server/domains/auth/AuthenticatorID';
import { SessionData } from '../../../../src/server/domains/auth/SessionData';


describe('ParticipantServiceImpl', () => {
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

	describe('#joinRoom', () => {
		const invitationCode = InvitationCode.create({ value: '123456' });
		const room: RoomDetailEntity = RoomDetail.create({ room: { name: 'Test_Room' }, invitationCode: '123456' });

		it('正常系', async () => {
			const expected: RoomDetailEntity = RoomDetail.create({ room: { id: room.room.id.value, name: 'Test_Room' }, invitationCode: '123456', participants: [sessionData.user!] });

			room.isRemainingCapacity = jest.fn().mockReturnValueOnce(true);
			roomRepository.getRoom = jest.fn().mockReturnValue(room);

			const roomService = new ParticipantServiceImpl(roomRepository);
			const result = await roomService.joinRoom(invitationCode, sessionData);

			expect(expected.isEqualTo(result)).toBeTruthy();
		});

		it('部屋が存在しない場合', async () => {
			roomRepository.getRoom = jest.fn().mockReturnValue(null);
			const roomService = new ParticipantServiceImpl(roomRepository);

			await expect(roomService.joinRoom(invitationCode, sessionData)).rejects.toThrowError();
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const roomService = new ParticipantServiceImpl(roomRepository);
			sessionData.authenticatorId = null;

			await expect(roomService.joinRoom(invitationCode, sessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const roomService = new ParticipantServiceImpl(roomRepository);
			sessionData.user = null;

			await expect(roomService.joinRoom(invitationCode, sessionData)).rejects.toThrowError();
		});

		it('部屋の許容人数を超えているならエラー', async () => {
			room.isRemainingCapacity = jest.fn().mockReturnValueOnce(false);
			roomRepository.getRoom = jest.fn().mockReturnValue(room);

			const roomService = new ParticipantServiceImpl(roomRepository);

			await expect(roomService.joinRoom(invitationCode, sessionData)).rejects.toThrowError();
		});
	});

	describe('#exitRoom', () => {
		const room: RoomDetailEntity = RoomDetail.create({ room: { name: 'Test_Room' }, invitationCode: '123456' });

		it('正常系', async () => {
			roomRepository.getRoom = jest.fn().mockReturnValue(room);
			const roomService = new ParticipantServiceImpl(roomRepository);
			await roomService.exitRoom(room.room.id, sessionData);

			expect(roomRepository.removeParticipant).toHaveBeenCalled;
		});

		it('部屋が存在しない場合', async () => {
			roomRepository.getRoom = jest.fn().mockReturnValue(null);
			const roomService = new ParticipantServiceImpl(roomRepository);

			await expect(roomService.exitRoom(room.room.id, sessionData)).rejects.toThrowError();
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const roomService = new ParticipantServiceImpl(roomRepository);
			sessionData.authenticatorId = null;

			await expect(roomService.exitRoom(room.room.id, sessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const roomService = new ParticipantServiceImpl(roomRepository);
			sessionData.user = null;

			await expect(roomService.exitRoom(room.room.id, sessionData)).rejects.toThrowError();
		});
	});
});
