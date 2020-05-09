import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { Room, RoomEntity } from '../../../../src/server/domains/room/Room';
import { InvitationCode } from '../../../../src/server/domains/room/InvitationCode';
import { RoomRepositoryImpl } from '../../../../src/server/infrastractures/room/RoomRepositoryImpl';
import { User } from '../../../../src/server/domains/user/User';

import { UnixTimestamp } from '../../../../src/server/utils/UnixTimestamp';

describe('RoomRepositoryImpl', () => {
    let mongod: MongoMemoryServer;
	let client: MongoClient;

	let roomRepository: RoomRepositoryImpl;

	const player1 = User.create({ name: 'Test_Player' });

	const room1: RoomEntity = Room.create({ invitationCode: '123456', playerCount: 2, createdAt: UnixTimestamp.now() });
	const room2: RoomEntity = Room.create({ invitationCode: '234567', playerCount: 2, createdAt: UnixTimestamp.now(), players: [player1] });

	beforeAll(async () => {
        mongod = new MongoMemoryServer();
		client = new MongoClient(await mongod.getConnectionString());
		await client.connect();

		roomRepository = new RoomRepositoryImpl(client, 'test-database');
	});

	beforeEach(async () => {
        await client.db('test-database').dropDatabase();

		// Initial datas
		await roomRepository.createRoom(room1);
		await roomRepository.createRoom(room2);
    });

	afterAll(async () => {
        await roomRepository.close();
        await mongod.stop();
	});

	describe('getRoom', () => {
		it('正常系', async () => {
			const room = await roomRepository.getRoom({ id: room1.id });

			expect(room1.isEqualTo(room)).toBeTruthy();
		});

		it('招待コードを指定して、結果が帰ってくる場合', async () => {
			const room = await roomRepository.getRoom({ invitationCode: room1.invitationCode });

			expect(room1.isEqualTo(room)).toBeTruthy();
		});

		it('招待コードを指定して、結果が帰ってこない場合', async () => {
			const room = await roomRepository.getRoom({ invitationCode: InvitationCode.create({ value: '000000' }) });

			expect(room).toEqual(null);
		});
	});

	describe('createRoom', () => {
		it('正常系', async () => {
			const room3: RoomEntity = Room.create({ invitationCode: '345678', playerCount: 2, createdAt: UnixTimestamp.now() });

			await roomRepository.createRoom(room3);
			const room = await roomRepository.getRoom({ id: room3.id });

			expect(room3.isEqualTo(room)).toBeTruthy();
		});

		it('すでに存在するIDならエラー', async () => {
			const room3: RoomEntity = Room.create({ invitationCode: '345678', playerCount: 2, createdAt: UnixTimestamp.now() }, room2.id.value);

			await expect(roomRepository.createRoom(room3)).rejects.toThrowError();
		});

		it('すでに存在する招待コードならエラー', async () => {
			const room3: RoomEntity = Room.create({ invitationCode: room2.invitationCode.value, playerCount: 2, createdAt: UnixTimestamp.now() });

			await expect(roomRepository.createRoom(room3)).rejects.toThrowError();
		});
	});

	describe('addPlayer', () => {
		it('正常系', async () => {
			const user = User.create({ name: 'Test_Player' });

			await roomRepository.addPlayer(room1, user);
			const room = await roomRepository.getRoom({ id: room1.id });

			const playersContainingUser = (room: any, user: any): boolean => room ? room.players.some((player) => player.isEqualTo(user)) : false;

			expect(playersContainingUser(room1, user)).toBeFalsy();
			expect(playersContainingUser(room, user)).toBeTruthy();
		});

		it('部屋が存在しないならエラー', async () => {
			const room3: RoomEntity = Room.create({ invitationCode: '345678', playerCount: 2, createdAt: UnixTimestamp.now() });
			const user = User.create({ name: 'Test_Player' });

			await expect(roomRepository.addPlayer(room3, user)).rejects.toThrowError();
		});

		it('すでに存在するプレイヤーならエラー', async () => {
			const user = User.create({ name: 'Test_Player' });
			const room3: RoomEntity = Room.create({ invitationCode: '345678', playerCount: 2, players: [user], createdAt: UnixTimestamp.now() });

			await roomRepository.createRoom(room3);

			await expect(roomRepository.addPlayer(room3, user)).rejects.toThrowError();
		});
	});

	describe('removePlayer', () => {
		it('正常系', async () => {
			await roomRepository.removePlayer(room2, player1);
			const room = await roomRepository.getRoom({ id: room2.id });

			const playersContainingUser = (room: any, user: any): boolean => room ? room.players.some((player) => player.isEqualTo(user)) : false;

			expect(playersContainingUser(room, player1)).toBeFalsy();
			expect(playersContainingUser(room2, player1)).toBeTruthy();
		});

		it('部屋が存在しないならエラー', async () => {
			const room3: RoomEntity = Room.create({ invitationCode: '345678', playerCount: 2, createdAt: UnixTimestamp.now() });
			const user = User.create({ name: 'Test_Player' });

			await expect(roomRepository.removePlayer(room3, user)).rejects.toThrowError();
		});

		it('すでに存在しないプレイヤーならエラー', async () => {
			const user = User.create({ name: 'Test_Player' });

			await expect(roomRepository.removePlayer(room2, user)).rejects.toThrowError();
		});
	});
});
