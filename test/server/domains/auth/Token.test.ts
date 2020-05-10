import { Token } from '../../../../src/server/domains/auth/Token';
import { SecureRandom } from '../../../../src/server/utils/SecureRandom';

describe('Token', () => {
	const uuid = SecureRandom.uuid();
	const token = Token.create({ value: `Bearer ${uuid}` });

	describe('value', () => {
		describe('正常系', () => {
			it('Bearerトークンが与えられたならトークンを返す', async () => {
				expect(token.value).toBe(uuid);
			});

			it('Bearerトークンが与えられていないなら空文字を返す', async () => {
				const fakeToken = Token.create({ value: `Bear ${uuid}` });

				expect(fakeToken.value).toBe('');
			});
		});
	});

	describe('isBearer', () => {
		describe('正常系', () => {
			it('Bearerトークンが与えられたなら真', async () => {
				expect(token.isBearer).toBeTruthy();
			});

			it('Bearerトークンが与えられていないなら偽', async () => {
				const fakeToken = Token.create({ value: `Bear ${uuid}` });

				expect(fakeToken.isBearer).toBeFalsy();
			});
		});
	});
});
