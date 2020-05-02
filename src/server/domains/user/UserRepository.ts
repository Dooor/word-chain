import { AuthenticatorID } from '@server/domains/auth/AuthenticatorID';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { User, UserEntity } from '@server/domains/user/User';

export interface UserRepository {
	/**
	 * ユーザーIDを指定して、ユーザーを取得する
	 * @return ユーザー。存在しない場合はnullを返す
	 */
	getUserById: (id: UniqueEntityID) => Promise<User | null>;

	/**
	 * 認証用IDを指定して、ユーザーを取得する
	 * @return ユーザー。存在しない場合はnullを返す
	 */
	getUserByAuthenticatorId: (authenticatorId: AuthenticatorID) => Promise<User | null>;

	/**
	 * ユーザーを作成する
	 */
	createUser: (authenticatorId: AuthenticatorID, user: UserEntity) => Promise<void>;
}
