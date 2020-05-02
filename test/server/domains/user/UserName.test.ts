import { UserName } from '../../../../src/server/domains/user/UserName';

describe('UserName', () => {
	describe('create', () => {
		it('正常系', async () => {
			const name = 'Tester';
			const userName = UserName.create({ value: name });

			expect(userName.value).toEqual(name);
		});

		describe('異常系', () => {
			it('ユーザー名が空文字の場合エラー', async () => {
				const name = '';

				await expect(async () => UserName.create({ value: name })).rejects.toThrowError();
			});
		});
	});
});
