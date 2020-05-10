import { OwnerServiceImpl } from '../../../../src/server/services/room/OwnerService';

import { RoomRepository } from '../../../../src/server/domains/room/RoomRepository';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';
import { User } from '../../../../src/server/domains/user/User';
import { AuthenticatorID } from '../../../../src/server/domains/auth/AuthenticatorID';
import { SessionData } from '../../../../src/server/domains/auth/SessionData';
import { RoomName } from '../../../../src/server/domains/room/Room/Name';
import { Capacity } from '../../../../src/server/domains/room/RoomDetail/Capacity';


describe('OwnerServiceImpl', () => {
	const user = User.create({ name: 'Tester' });
	const authenticatorId = AuthenticatorID.create({ value: SecureRandom.uuid() });
	const roomName = RoomName.create({ value: 'Test_Room' });
	const capacity = Capacity.create({ value: 2 });

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
			const ownerService = new OwnerServiceImpl(roomRepository);
			await ownerService.createRoom(roomName, capacity, sessionData);

			expect(roomRepository.createRoom).toHaveBeenCalled;
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository);
			sessionData.authenticatorId = null;

			await expect(ownerService.createRoom(roomName, capacity, sessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository);
			sessionData.user = null;

			await expect(ownerService.createRoom(roomName, capacity, sessionData)).rejects.toThrowError();
		});
	});
});
