// Library
import mongodb from 'mongodb';

// Mongo
import { MongoGame } from './models/MongoGame';
import { MongoQuestion } from './models/MongoQuestion';

// Domains
import { GameRepository } from '@server/domains/game/GameRepository';
import { QuestionEntity } from '@server/domains/game/Question';
import { GameEntity, Game } from '@server/domains/game/Game';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

export class GameRepositoryImpl implements GameRepository {
	private readonly client: mongodb.MongoClient;
    private readonly gameCollection: mongodb.Collection<MongoGame>;

	constructor(client: mongodb.MongoClient, dbName: string) {
		this.client = client;
		this.gameCollection = this.client.db(dbName).collection('rooms');
	}

    async close(): Promise<void> {
        await this.client.close();
    }

	/**
     * ゲームを取得する
	 * @return ゲーム。存在しない場合はnullを返す
     */
	getGame = async (id: UniqueEntityID): Promise<Game | null> => {
		const mongoGame = await this.gameCollection.findOne({
			id: id.value,
			deletedAt: null,
		});

		if (!mongoGame) {
			return null;
		}

		return MongoGame.toGame(mongoGame);
	}

	/**
	 * ゲームを作成する
	 */
	createGame = async (game: GameEntity): Promise<void> => {
		const mongoGame = MongoGame.fromGame(game);

		if (await this.getGame(game.id)) {
            throw new Error(`Duplicated game ID: ${ mongoGame.id }`);
        }

        await this.gameCollection.insertOne(mongoGame);
	}

	/**
	 * 質問を追加する。
	 */
	addQuestion = async (gameId: UniqueEntityID, question: QuestionEntity): Promise<void> => {
		const mongoQuestion = MongoQuestion.fromQuestion(question);
		const game = await this.getGame(gameId);

		if (!game) {
            throw new Error(`Not found game by ID: ${ gameId.value }`);
		}
		if (!game.canAddQuestion(question)) {
            throw new Error(`Question's turn muest be later before questions: ${ mongoQuestion.turn }`);
		}

		await this.gameCollection.update({
			id: gameId.value
		}, {
			$push: {
				questions: mongoQuestion,
			}
		});
	}
}
