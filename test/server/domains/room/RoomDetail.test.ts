import { RoomDetail } from '../../../../src/server/domains/room/RoomDetail';

describe('RoomDetail', () => {
	describe('create', () => {
		it('正常系', async () => {
			const name = 'Test_Room';
			const invitationCode = '123456';
			const capacity = 2;
			const createdAt = 1588258800;
			const roomDetail = RoomDetail.create({ room: { name }, invitationCode, capacity, createdAt });

			expect(roomDetail.room.name.value).toEqual(name);
			expect(roomDetail.invitationCode.value).toEqual(invitationCode);
			expect(roomDetail.capacity.value).toEqual(capacity);
			expect(roomDetail.createdAt.value).toEqual(createdAt);
		});
	});
});
