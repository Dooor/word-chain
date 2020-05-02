import { UserRepository } from '@server/domains/user/UserRepository';
import { AuthRepository } from '@server/domains/auth/AuthRepository';
import { Token } from '@server/domains/auth/Token';
import { SessionData } from '@server/domains/auth/SessionData';

export interface AuthService {
	/**
	 * 与えられたBearerトークンで認証を行い、セッションデータを返す。
	 * @return セッションデータ
	 */
	authenticate: (authorization: string) => Promise<SessionData>;
}

export class AuthServiceImpl implements AuthService {
	constructor(
		private authRepository: AuthRepository,
		private userRepository: UserRepository
	) {}

	authenticate = async (authorization: string): Promise<SessionData> => {
		const token = Token.create({ value: authorization });

		if (!token.isBearer) {
			return {
				token: null,
				authenticatorId: null,
				user: null,
			};
		}

		const authenticatorId = await this.authRepository.authenticate(token);
		const user = authenticatorId ? await this.userRepository.getUserByAuthenticatorId(authenticatorId) : null;

		return {
			authenticatorId,
			token,
			user,
		};
	}
}
