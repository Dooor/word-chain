import { OwnerServiceImpl } from '../../../../src/server/services/room/OwnerService';

import { RoomRepository } from '../../../../src/server/domains/room/RoomRepository';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';
import { User } from '../../../../src/server/domains/user/User';
import { AuthenticatorID } from '../../../../src/server/domains/auth/AuthenticatorID';
import { SessionData } from '../../../../src/server/domains/auth/SessionData';


describe('OwnerServiceImpl', () => {
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
			const ownerService = new OwnerServiceImpl(roomRepository);
			await ownerService.createRoom(sessionData);

			expect(roomRepository.createRoom).toHaveBeenCalled;
		});

		it('認証用IDの取得に失敗したならエラー', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository);
			sessionData.authenticatorId = null;

			await expect(ownerService.createRoom(sessionData)).rejects.toThrowError();
		});

		it('ユーザーの登録が完了していないならエラー', async () => {
			const ownerService = new OwnerServiceImpl(roomRepository);
			sessionData.user = null;

			await expect(ownerService.createRoom(sessionData)).rejects.toThrowError();
		});
	});
});
