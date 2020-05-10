import { RoomDetail } from '../../../../src/server/domains/room/RoomDetail';

import { User } from '../../../../src/server/domains/user/User';

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

	describe('isRemainingCapacity', () => {
		it('許容人数に達していないなら真', async () => {
			const name = 'Test_Room';
			const invitationCode = '123456';
			const capacity = 1;
			const createdAt = 1588258800;
			const roomDetail = RoomDetail.create({ room: { name }, invitationCode, capacity, createdAt });

			expect(roomDetail.isRemainingCapacity()).toBeTruthy();
		});

		it('許容人数に達しているなら偽', async () => {
			const name = 'Test_Room';
			const invitationCode = '123456';
			const capacity = 1;
			const createdAt = 1588258800;
			const user = User.create({ name: 'Test_User' });
			const roomDetail = RoomDetail.create({ room: { name }, participants: [user], invitationCode, capacity, createdAt });

			expect(roomDetail.isRemainingCapacity()).toBeFalsy();
		});
	});
});
