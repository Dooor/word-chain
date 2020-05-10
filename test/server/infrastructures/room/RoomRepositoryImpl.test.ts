import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { RoomDetail, RoomDetailEntity } from '../../../../src/server/domains/room/RoomDetail';
import { InvitationCode } from '../../../../src/server/domains/room/RoomDetail/InvitationCode';
import { RoomRepositoryImpl } from '../../../../src/server/infrastractures/room/RoomRepositoryImpl';
import { User } from '../../../../src/server/domains/user/User';

import { UnixTimestamp } from '../../../../src/server/utils/UnixTimestamp';

describe('RoomRepositoryImpl', () => {
    let mongod: MongoMemoryServer;
	let client: MongoClient;

	let roomRepository: RoomRepositoryImpl;

	const participant1 = User.create({ name: 'Test_Participant' });

	const room1: RoomDetailEntity = RoomDetail.create({ room: { name: 'Test_Room_1' }, invitationCode: '123456', playerCount: 2, createdAt: UnixTimestamp.now() });
	const room2: RoomDetailEntity = RoomDetail.create({ room: { name: 'Test_Room_2' }, invitationCode: '234567', playerCount: 2, createdAt: UnixTimestamp.now(), participants: [participant1] });

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
			const room = await roomRepository.getRoom({ id: room1.room.id });

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
			const room3: RoomDetailEntity = RoomDetail.create({ room: { name: 'Test_Room' }, invitationCode: '345678', playerCount: 2, createdAt: UnixTimestamp.now() });

			await roomRepository.createRoom(room3);
			const room = await roomRepository.getRoom({ id: room3.room.id });

			expect(room3.isEqualTo(room)).toBeTruthy();
		});

		it('すでに存在するIDならエラー', async () => {
			const room3: RoomDetailEntity = RoomDetail.create({ room: { id: room2.room.id.value, name: 'Test_Room' }, invitationCode: '345678', playerCount: 2, createdAt: UnixTimestamp.now() });

			await expect(roomRepository.createRoom(room3)).rejects.toThrowError();
		});

		it('すでに存在する招待コードならエラー', async () => {
			const room3: RoomDetailEntity = RoomDetail.create({ room: { name: 'Test_Room' }, invitationCode: room2.invitationCode.value, playerCount: 2, createdAt: UnixTimestamp.now() });

			await expect(roomRepository.createRoom(room3)).rejects.toThrowError();
		});
	});

	describe('addParticipant', () => {
		it('正常系', async () => {
			const user = User.create({ name: 'Test_Participant' });

			await roomRepository.addParticipant(room1, user);
			const room = await roomRepository.getRoom({ id: room1.room.id });

			expect(room1.hasContainedUser(user)).toBeFalsy();
			expect(room!.hasContainedUser(user)).toBeTruthy();
		});

		it('部屋が存在しないならエラー', async () => {
			const room3: RoomDetailEntity = RoomDetail.create({ room: { name: 'Test_Room' }, invitationCode: '345678', playerCount: 2, createdAt: UnixTimestamp.now() });
			const user = User.create({ name: 'Test_Participant' });

			await expect(roomRepository.addParticipant(room3, user)).rejects.toThrowError();
		});

		it('すでに存在するプレイヤーならエラー', async () => {
			const user = User.create({ name: 'Test_Participant' });
			const room3: RoomDetailEntity = RoomDetail.create({ room: { name: 'Test_Room' }, invitationCode: '345678', playerCount: 2, participants: [user], createdAt: UnixTimestamp.now() });

			await roomRepository.createRoom(room3);

			await expect(roomRepository.addParticipant(room3, user)).rejects.toThrowError();
		});
	});

	describe('removeParticipant', () => {
		it('正常系', async () => {
			await roomRepository.removeParticipant(room2, participant1);
			const room = await roomRepository.getRoom({ id: room2.room.id });

			expect(room2.hasContainedUser(participant1)).toBeTruthy();
			expect(room!.hasContainedUser(participant1)).toBeFalsy();
		});

		it('部屋が存在しないならエラー', async () => {
			const room3: RoomDetailEntity = RoomDetail.create({ room: { name: 'Test_Room' }, invitationCode: '345678', playerCount: 2, createdAt: UnixTimestamp.now() });
			const user = User.create({ name: 'Test_Participant' });

			await expect(roomRepository.removeParticipant(room3, user)).rejects.toThrowError();
		});

		it('すでに存在しないプレイヤーならエラー', async () => {
			const user = User.create({ name: 'Test_Participant' });

			await expect(roomRepository.removeParticipant(room2, user)).rejects.toThrowError();
		});
	});
});
