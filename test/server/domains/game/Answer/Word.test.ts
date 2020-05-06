import { Word } from '../../../../../src/server/domains/game/Answer/Word';

describe('Word', () => {
	describe('create', () => {
		it('正常系', async () => {
			const value = 'abcdef';
			const word = Word.create({ value });

			expect(word.value).toEqual(value);
		});

		describe('異常系', () => {
			it('文字が空文字の場合', async () => {
				const value = '';

				await expect(async () => Word.create({ value })).rejects.toThrowError();
			});

			it('文字が1文字の場合', async () => {
				const value = 'a';

				await expect(async () => Word.create({ value })).rejects.toThrowError();
			});
		});
	});

	describe('initial', () => {
		it('正常系', async () => {
			const value = 'abcdef';
			const word = Word.create({ value });

			expect(word.initial).toEqual('a');
		});
	});

	describe('fianl', () => {
		it('正常系', async () => {
			const value = 'abcdef';
			const word = Word.create({ value });

			expect(word.final).toEqual('f');
		});
	});
});
