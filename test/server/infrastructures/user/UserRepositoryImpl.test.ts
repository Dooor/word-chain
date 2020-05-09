import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { AuthenticatorID } from '../../../../src/server/domains/auth/AuthenticatorID';
import { UniqueEntityID } from '../../../../src/server/domains/core/UniqueEntityID';
import { User, UserEntity } from '../../../../src/server/domains/user/User';
import { UserRepositoryImpl } from '../../../../src/server/infrastractures/user/UserRepositoryImpl';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';

describe('UserRepositoryImpl', () => {
    let mongod: MongoMemoryServer;
	let client: MongoClient;

	let userRepository: UserRepositoryImpl;

	const authenticatorId1 = AuthenticatorID.create({ value: SecureRandom.uuid() });
	const authenticatorId2 = AuthenticatorID.create({ value: SecureRandom.uuid() });

	const user1: UserEntity = User.create({ name: 'Tester1' });
	const user2: UserEntity = User.create({ name: 'Tester2' });

	beforeAll(async () => {
        mongod = new MongoMemoryServer();
		client = new MongoClient(await mongod.getConnectionString());
		await client.connect();

		userRepository = new UserRepositoryImpl(client, 'test-database');
	});

	beforeEach(async () => {
        await client.db('test-database').dropDatabase();

		// Initial datas
		await userRepository.createUser(authenticatorId1, user1);
		await userRepository.createUser(authenticatorId2, user2);
    });

	afterAll(async () => {
        await userRepository.close();
        await mongod.stop();
	});

	describe('getUserById', () => {
		it('正常系', async () => {
			const user = await userRepository.getUserById(user1.id);

			expect(user1.isEqualTo(user)).toBeTruthy();
		});

		it('IDを指定して、結果が帰ってこない場合', async () => {
			const user = await userRepository.getUserById(UniqueEntityID.create());

			expect(user).toBeNull;
		});
	});

	describe('getUserByAuthenticatorId', () => {
		it('正常系', async () => {
			const user = await userRepository.getUserByAuthenticatorId(authenticatorId1);

			expect(user1.isEqualTo(user)).toBeTruthy();
		});

		it('IDを指定して、結果が帰ってこない場合', async () => {
			const dummyAuthenticatorId = AuthenticatorID.create({ value: SecureRandom.uuid() });
			const user = await userRepository.getUserByAuthenticatorId(dummyAuthenticatorId);

			expect(user).toBeNull;
		});
	});

	describe('createUser', () => {
		it('正常系', async () => {
			const newAuthenticatorId = AuthenticatorID.create({ value: SecureRandom.uuid() });
			const newUser: UserEntity = User.create({ name: 'Tester_New' });

			await userRepository.createUser(newAuthenticatorId, newUser);

			const user = await userRepository.getUserById(newUser.id);
			expect(newUser.isEqualTo(user)).toBeTruthy();
		});

		it('すでに存在しているIDならエラー', async () => {
			const newAuthenticatorId = AuthenticatorID.create({ value: SecureRandom.uuid() });
			const newUser: UserEntity = User.create({ name: 'Tester_New' }, user1.id.value);

			await expect(userRepository.createUser(newAuthenticatorId, newUser)).rejects.toThrowError();
		});

		it('すでに存在している認証用IDならエラー', async () => {
			const newUser: UserEntity = User.create({ name: 'Tester_New' });

			await expect(userRepository.createUser(authenticatorId1, newUser)).rejects.toThrowError();
		});
	});
});
