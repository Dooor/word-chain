import { AuthService } from './AuthService';
import { AuthenticatorID } from '@server/domains/auth/AuthenticatorID';
import { Token } from '@server/domains/auth/Token';

export class MockAuthService implements AuthService {
	/**
	 * 与えられたトークンをそのまま認証IDとして返す。
	 * つまり、ログインしたいユーザーの認証IDをトークンに指定すればログインできる。
	 */
	authenticate = async (token: Token): Promise<AuthenticatorID | null> => {
		return AuthenticatorID.create({ value: token.value });
	}
}
