import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

// Domains
import { UniqueEntityID } from '../../../../src/server/domains/core/UniqueEntityID';
import { Player } from '../../../../src/server/domains/game/Player';
import { Game, GameEntity } from '../../../../src/server/domains/game/Game';
import { Question } from '../../../../src/server/domains/game/Question';
import { GameRepositoryImpl } from '../../../../src/server/infrastractures/game/GameRepositoryImpl';

// utils
import { UnixTimestamp } from '../../../../src/server/utils/UnixTimestamp';
import { SecureRandom } from '../../../../src/server/utils/SecureRandom';

describe('GameRepositoryImpl', () => {
	let mongod: MongoMemoryServer;
	let client: MongoClient;

	let gameRepository: GameRepositoryImpl;

	const player = Player.create({ turn: 1, user: { id: SecureRandom.uuid(), name: 'Test_Player' } });

	const nowTimestamp = UnixTimestamp.now();
	const question1 = Question.create({ body: 'a', turn: 1, createdAt: nowTimestamp, answerer: { turn: 1, user: { id: SecureRandom.uuid(), name: 'Answerer' } } });

	const game1: GameEntity = Game.create({ room: { id: SecureRandom.uuid(), name: 'Test_Room' }, players: [player], questions: [question1] });
	const game2: GameEntity = Game.create({ room: { id: SecureRandom.uuid(), name: 'Test_Room' }, players: [player], questions: [question1] });

	beforeAll(async () => {
        mongod = new MongoMemoryServer();
		client = new MongoClient(await mongod.getConnectionString());
		await client.connect();

		gameRepository = new GameRepositoryImpl(client, 'test-database');
	});

	beforeEach(async () => {
        await client.db('test-database').dropDatabase();

		// Initial datas
		await gameRepository.createGame(game1);
		await gameRepository.createGame(game2);
    });

	afterAll(async () => {
        await gameRepository.close();
        await mongod.stop();
	});

	describe('getGame', () => {
		it('正常系', async () => {
			const game = await gameRepository.getGame(game1.id);

			expect(game1.isEqualTo(game)).toBeTruthy();
		});

		it('IDを指定して、結果が帰ってこない場合', async () => {
			const game = await gameRepository.getGame(UniqueEntityID.create({ value: SecureRandom.uuid() }));

			expect(game).toEqual(null);
		});
	});

	describe('createGame', () => {
		it('正常系', async () => {
			const game3: GameEntity = Game.create({ room: { id: SecureRandom.uuid(), name: 'Test_Room' }, players: [player] });

			await gameRepository.createGame(game3);
			const game = await gameRepository.getGame(game3.id);

			expect(game3.isEqualTo(game)).toBeTruthy();
		});

		it('すでに存在するIDならエラー', async () => {
			const game3: GameEntity = Game.create({ room: { id: SecureRandom.uuid(), name: 'Test_Room' }, players: [player] }, game2.id.value);

			await expect(gameRepository.createGame(game3)).rejects.toThrowError();
		});
	});

	describe('addQuestion', () => {
		const answerer = { id: SecureRandom.uuid(), turn: 2, user: { id: SecureRandom.uuid(), name: 'Answerer' } };

		it('正常系', async () => {
			const question = Question.create({ body: 'a', turn: 2, createdAt: nowTimestamp, answerer });
			await gameRepository.addQuestion(game1.id, question);

			const game = await gameRepository.getGame(game1.id);

			expect(game!.latestQuestion!.isEqualTo(question)).toBeTruthy();
		});

		it('指定したゲームIDが存在しないならエラー', async () => {
			const question = Question.create({ body: 'a', turn: 2, createdAt: nowTimestamp, answerer });

			await expect(gameRepository.addQuestion(UniqueEntityID.create(), question)).rejects.toThrowError();
		});

		it('問題の順番が過去の問題より後ではないならエラー', async () => {
			const question = Question.create({ body: 'a', turn: 1, createdAt: nowTimestamp, answerer });

			await expect(gameRepository.addQuestion(game1.id, question)).rejects.toThrowError();
		});
	});
});
