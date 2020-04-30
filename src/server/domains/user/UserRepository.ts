import { AuthenticatorID } from '@server/domains/auth/AuthenticatorID';
import { UserEntity } from '@server/domains/user/User';

export interface UserRepository {
	/**
	 * ユーザーIDを指定して、ユーザーを取得する
	 * @return ユーザー。存在しない場合はnullを返す
	 */
	getUserById: (id: string) => Promise<UserEntity | null>;

	/**
	 * 認証用IDを指定して、ユーザーを取得する
	 * @return ユーザー。存在しない場合はnullを返す
	 */
	getUserByAuthenticatorId: (authenticatorId: AuthenticatorID) => Promise<UserEntity | null>;

	/**
	 * ユーザーを作成する
	 */
	createUser: (authenticatorId: AuthenticatorID, user: UserEntity) => Promise<void>;
}
