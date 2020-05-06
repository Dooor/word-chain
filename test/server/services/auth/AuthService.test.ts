import { AuthServiceImpl } from '../../../../src/server/services/auth/AuthService';

import { AuthRepository } from '../../../../src/server/domains/auth/AuthRepository';
import { AuthenticatorID } from '../../../../src/server/domains/auth/AuthenticatorID';
import { Token } from '../../../../src/server/domains/auth/Token';
import { UserRepository } from '../../../../src/server/domains/user/UserRepository';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';
import { User } from '../../../../src/server/domains/user/User';


describe('AuthServiceImpl', () => {
	describe('#authenticate', () => {
		const authorization = `Bearer ${SecureRandom.uuid()}`;
		const user = User.create({ name: 'Tester' });
		const token = Token.create({ value: authorization });
		const authenticatorId = AuthenticatorID.create({ value: SecureRandom.uuid() });

		let authRepository: AuthRepository;
		let userRepository: UserRepository;

		beforeEach(() => {
			authRepository = {
				authenticate: jest.fn().mockReturnValue(authenticatorId),
			};
			userRepository  = {
				getUserById: jest.fn().mockReturnValue(user),
				getUserByAuthenticatorId: jest.fn().mockReturnValue(user),
				createUser: jest.fn().mockReturnThis(),
			};
		});

		it('正常系', async () => {
			const authService = new AuthServiceImpl(authRepository, userRepository);
			const result = await authService.authenticate(token);

			expect(result).toEqual({
				authenticatorId,
				token,
				user
			});
		});

		it('与えられた文字列がBearerトークンではない場合', async () => {
			const authService = new AuthServiceImpl(authRepository, userRepository);
			const fakeToken = Token.create({ value: `Fake ${SecureRandom.uuid()}` });
			const result = await authService.authenticate(fakeToken);

			expect(result).toEqual({
				authenticatorId: null,
				token: null,
				user: null
			});
		});

		it('認証用IDの取得に失敗した場合', async () => {
			authRepository = Object.assign({}, authRepository, { authenticate: jest.fn().mockReturnValue(null) });

			const authService = new AuthServiceImpl(authRepository, userRepository);
			const result = await authService.authenticate(token);

			expect(result).toEqual({
				authenticatorId: null,
				token,
				user: null
			});
		});

		it('ユーザーの登録が完了していない場合', async () => {
			userRepository = Object.assign({}, userRepository, { getUserByAuthenticatorId: jest.fn().mockReturnValue(null) });

			const authService = new AuthServiceImpl(authRepository, userRepository);
			const result = await authService.authenticate(token);

			expect(result).toEqual({
				authenticatorId,
				token,
				user: null
			});
		});
	});
});
