// core
import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

// game
import { QuestionEntity } from '@server/domains/game/Question';
import { PlayerEntity } from '@server/domains/game/Player';

export interface GameProps {
	players: PlayerEntity[];
	questions: QuestionEntity[];
	createdAt: DateTime;
}

export interface GameFactoryProps {
	players: PlayerEntity[];
	questions?: QuestionEntity[];
	createdAt?: number;
}

export type GameEntity = GameProps & EntityInterface<GameProps>

export class Game extends Entity<GameProps> implements GameEntity {
	private constructor(props: GameProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props: GameFactoryProps, id?: string): Game {
		const players = props.players;
		const questions = props.questions || [];
		const createdAt = DateTime.create({ value: props && props.createdAt });

		return new Game({ players, questions, createdAt }, UniqueEntityID.create({ value: id }));
	}

	get players(): PlayerEntity[] {
		return this.props.players;
	}

	get questions(): QuestionEntity[] {
		return this.props.questions;
	}

	get createdAt(): DateTime {
		return this.props.createdAt;
	}

	get latestQuestion(): QuestionEntity | null {
		if (this.questions.length === 0) {
			return null;
		}

		return this.props.questions.sort((a, b) => a.isLater(b) ? -1 : 1)[0];
	}

	canAddQuestion = (question: QuestionEntity): boolean => {
		if (this.questions.length === 0) {
			return true;
		}

		return question.isLater(this.latestQuestion!);
	}
}
