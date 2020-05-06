import { Room } from '../../../../src/server/domains/room/Room';

describe('Room', () => {
	describe('create', () => {
		it('正常系', async () => {
			const invitationCode = '123456';
			const playerCount = 2;
			const createdAt = 1588258800;
			const room = Room.create({ invitationCode, playerCount, createdAt });

			expect(room.invitationCode.value).toEqual(invitationCode);
			expect(room.playerCount.value).toEqual(playerCount);
			expect(room.createdAt.value).toEqual(createdAt);
		});
	});
});
