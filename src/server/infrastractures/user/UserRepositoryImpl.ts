
import mongodb from 'mongodb';
import { MongoUser } from './models/MongoUser';

import { UserEntity } from '@server/domains/user/User';
import { UserRepository } from '@server/domains/user/UserRepository';
import { AuthenticatorID } from '@server/domains/auth/AuthenticatorID';


export class UserRepositoryImpl implements UserRepository {
	private readonly client: mongodb.MongoClient;
    private readonly userCollection: mongodb.Collection<MongoUser>;

	constructor(client: mongodb.MongoClient, dbName: string) {
		this.client = client;
		this.userCollection = this.client.db(dbName).collection('users');
	}

    async close(): Promise<void> {
        await this.client.close();
    }

	/**
	 * ユーザーIDを指定して、ユーザーを取得する
	 * @return ユーザー。存在しない場合はnullを返す
     */
	getUserById = async (id: string): Promise<UserEntity | null> => {
		const mongoUser = await this.userCollection.findOne({
			'user.id': id,
			deletedAt: null,
		});

		if (!mongoUser) {
			return null;
		}

		return MongoUser.toUser(mongoUser);
	}

	/**
	 * 認証用IDを指定して、ユーザーを取得する
	 * @return ユーザー。存在しない場合はnullを返す
     */
	getUserByAuthenticatorId = async (authenticatorId: AuthenticatorID): Promise<UserEntity | null> => {
		const mongoUser = await this.userCollection.findOne({
			authenticatorId: authenticatorId.value,
			deletedAt: null,
		});

		if (!mongoUser) {
			return null;
		}

		return MongoUser.toUser(mongoUser);
	}

	/**
	 * ユーザーを作成する
	 */
	createUser = async (authenticatorId: AuthenticatorID, user: UserEntity): Promise<void> => {
		const mongoUser = MongoUser.fromUser(authenticatorId, user);

		if (await this.getUserByAuthenticatorId(authenticatorId)) {
            throw new Error(`Duplicated authenticator ID: ${ authenticatorId.value }`);
        }
		if (await this.getUserById(user.id.value)) {
            throw new Error(`Duplicated user ID: ${ user.id.value }`);
        }

		await this.userCollection.insertOne(mongoUser);
	}
}
