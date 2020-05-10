import { Capacity } from '../../../../src/server/domains/room/RoomDetail/Capacity';

describe('Capacity', () => {
	describe('create', () => {
		it('正常系', async () => {
			const value = 2;
			const capacity = Capacity.create({ value });

			expect(capacity.value).toEqual(value);
		});

		describe('異常系', () => {
			it('プレイヤー数が0以下の場合エラー', async () => {
				const value = 0;

				await expect(async () => Capacity.create({ value })).rejects.toThrowError();
			});
		});
	});
});
