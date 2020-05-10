
import { Game, GameEntity } from '@server/domains/game/Game';

import { MongoPlayer } from '@server/infrastractures/game/models/MongoPlayer';
import { MongoQuestion } from './MongoQuestion';

export interface MongoGame {
    readonly id: string;
	readonly questions: any[];
	readonly players: MongoPlayer[];
	readonly createdAt: number;
	readonly deletedAt: number | null;
}

export namespace MongoGame {
    export function toGame(mongoGame: MongoGame): Game {
        return Game.create({
			questions: mongoGame.questions ? mongoGame.questions.map((question) => MongoQuestion.toQuestion(question)) : [],
			players: mongoGame.players ? mongoGame.players.map((player) => MongoPlayer.toPlayer(player)) : [],
			createdAt: mongoGame.createdAt,
		}, mongoGame.id);
    }

    export function fromGame(game: GameEntity): MongoGame {
        return {
			id: game.id.value,
			questions: game.questions.map((question) => MongoQuestion.fromQuestion(question)),
			players: game.players.map((player) => MongoPlayer.fromPlayer(player)),
			createdAt: game.createdAt.value,
			deletedAt: null,
        };
    }
}
