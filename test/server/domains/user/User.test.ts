import { User } from '../../../../src/server/domains/user/User';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';

describe('User', () => {
	describe('create', () => {
		describe('正常系', () => {
			it('ID指定なし', async () => {
				const name = 'Tester';
				const user = User.create({ name });

				expect(user.name.value).toEqual(name);
			});

			it('ID指定あり', async () => {
				const name = 'Tester';
				const id = SecureRandom.uuid();
				const user = User.create({ name }, id);

				expect(user.name.value).toEqual(name);
			});
		});

		describe('異常系', () => {
			it('ユーザー名が空文字の場合エラー', async () => {
				const name = '';

				await expect(async () => User.create({ name })).rejects.toThrowError();
			});
		});
	});
});
