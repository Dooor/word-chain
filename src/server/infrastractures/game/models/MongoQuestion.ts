
import { Question, QuestionEntity } from '@server/domains/game/Question';

import { MongoPlayer } from '@server/infrastractures/game/models/MongoPlayer';

export interface MongoQuestion {
	readonly id: string;
	readonly turn: number;
	readonly body: string;
	readonly answerer: MongoPlayer;
	readonly createdAt: number;
	readonly deletedAt: number | null;
}

export namespace MongoQuestion {
    export function toQuestion(mongoQuestion: MongoQuestion): Question {
        return Question.create({
			turn: mongoQuestion.turn,
			body: mongoQuestion.body,
			answerer: mongoQuestion.answerer,
			createdAt: mongoQuestion.createdAt,
		}, mongoQuestion.id);
    }

    export function fromQuestion(question: QuestionEntity): MongoQuestion {
        return {
			id: question.id.value,
			turn: question.turn.value,
			body: question.body.value,
			answerer: MongoPlayer.fromPlayer(question.answerer),
			createdAt: question.createdAt.value,
			deletedAt: null,
        };
    }
}
