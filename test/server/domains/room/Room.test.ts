import { RoomDetail } from '../../../../src/server/domains/room/RoomDetail';

describe('RoomDetail', () => {
	describe('create', () => {
		it('正常系', async () => {
			const name = 'Test_Room';
			const invitationCode = '123456';
			const playerCount = 2;
			const createdAt = 1588258800;
			const roomDetail = RoomDetail.create({ room: { name }, invitationCode, playerCount, createdAt });

			expect(roomDetail.room.name.value).toEqual(name);
			expect(roomDetail.invitationCode.value).toEqual(invitationCode);
			expect(roomDetail.playerCount.value).toEqual(playerCount);
			expect(roomDetail.createdAt.value).toEqual(createdAt);
		});
	});
});
