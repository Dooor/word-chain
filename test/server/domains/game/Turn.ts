import { Turn } from '../../../../src/server/domains/game/Turn';

describe('Turn', () => {
	describe('create', () => {
		it('正常系', async () => {
			const value = 1;
			const turn = Turn.create({ value });

			expect(turn.value).toEqual(value);
		});

		describe('異常系', () => {
			it('0の場合', async () => {
				const value = 0;

				await expect(async () => Turn.create({ value })).rejects.toThrowError();
			});
		});

		describe('異常系', () => {
			it('マイナスの場合', async () => {
				const value = -1;

				await expect(async () => Turn.create({ value })).rejects.toThrowError();
			});
		});
	});
});
