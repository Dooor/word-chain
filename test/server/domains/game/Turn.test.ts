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

	describe('isLater', () => {
		it('自分の方が順番が前の場合', async () => {
			const turn1 = Turn.create({ value: 1 });
			const turn2 = Turn.create({ value: 2 });

			expect(turn1.isLater(turn2)).toBeFalsy();
		});

		it('自分の方が順番が後の場合', async () => {
			const turn1 = Turn.create({ value: 2 });
			const turn2 = Turn.create({ value: 1 });

			expect(turn1.isLater(turn2)).toBeTruthy();
		});
	});
});
