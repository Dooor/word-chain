import { Body } from '../../../../../src/server/domains/game/Question/Body';

describe('Body', () => {
	describe('create', () => {
		it('正常系', async () => {
			const value = 'a';
			const body = Body.create({ value });

			expect(body.value).toEqual(value);
		});

		describe('異常系', () => {
			it('文字が空文字の場合', async () => {
				const value = '';

				await expect(async () => Body.create({ value })).rejects.toThrowError();
			});

			it('文字が2文字の場合', async () => {
				const value = 'ab';

				await expect(async () => Body.create({ value })).rejects.toThrowError();
			});
		});
	});
});
