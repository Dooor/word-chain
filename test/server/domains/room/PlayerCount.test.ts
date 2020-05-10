import { PlayerCount } from '../../../../src/server/domains/room/RoomDetail/PlayerCount';

describe('PlayerCount', () => {
	describe('create', () => {
		it('正常系', async () => {
			const value = 2;
			const playerCount = PlayerCount.create({ value });

			expect(playerCount.value).toEqual(value);
		});

		describe('異常系', () => {
			it('プレイヤー数が0以下の場合エラー', async () => {
				const value = 0;

				await expect(async () => PlayerCount.create({ value })).rejects.toThrowError();
			});
		});
	});
});
