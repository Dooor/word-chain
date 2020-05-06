import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { UserEntity, User } from '@server/domains/user/User';

import { Word } from '@server/domains/game/Answer/Word';
import { Turn } from '@server/domains/game/Turn';

export interface AnswerProps {
	turn: Turn;
	word: Word;
	answerer: UserEntity;
	createdAt: DateTime;
}

export interface AnswerFactoryProps {
	turn: number;
	word: {
		value: string;
	};
	answerer: {
		id: string;
		name: string;
	};
	createdAt: number;
}

export type AnswerEntity = AnswerProps & EntityInterface<AnswerProps>

export class Answer extends Entity<AnswerProps> implements AnswerEntity {
	constructor(props: AnswerProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props: AnswerFactoryProps, id?: string): Answer {
		const entityId = UniqueEntityID.create({ value: id });
		const turn = Turn.create({ value: props.turn });
		const word = Word.create({ value: props.word.value });
		const answerer = User.create({ name: props.answerer.name }, props.answerer.id);
		const createdAt = DateTime.create({ value: props.createdAt });

		return new Answer({
			turn,
			word,
			answerer,
			createdAt,
		}, entityId);
	}

	get turn(): Turn {
		return this.props.turn;
	}

	get word(): Word {
		return this.props.word;
	}

	get answerer(): UserEntity {
		return this.props.answerer;
	}

	get createdAt(): DateTime {
		return this.props.createdAt;
	}
}
