import { GameEntity, Game } from "./Game";

import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { QuestionEntity } from "@server/domains/game/Question";

export interface GameRepository {
	getGame: (gameId: UniqueEntityID) => Promise<Game | null>;
	createGame: (game: GameEntity) => Promise<void>;
	addQuestion: (gameId: UniqueEntityID, question: QuestionEntity) => Promise<void>;
}
