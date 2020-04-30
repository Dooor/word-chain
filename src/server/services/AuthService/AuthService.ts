import { AuthenticatorID } from '@server/domains/auth/AuthenticatorID';
import { Token } from '@server/domains/auth/Token';

export interface AuthService {
	/**
	 * 与えられたトークンで認証を行い、成功した場合は認証用IDを返す。
	 * @return token
	 */
	authenticate: (token: Token) => Promise<AuthenticatorID | null>;
}
