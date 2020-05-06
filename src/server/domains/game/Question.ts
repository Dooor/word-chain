import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { UserEntity, User } from '@server/domains/user/User';

import { Body } from '@server/domains/game/Question/Body';
import { Turn } from '@server/domains/game/Turn';

export interface QuestionProps {
	turn: Turn;
	body: Body;
	answerer: UserEntity;
	createdAt: DateTime;
}

export interface QuestionFactoryProps {
	turn: number;
	body: string;
	answerer: {
		id: string;
		name: string;
	};
	createdAt: number;
}

export type QuestionEntity = QuestionProps & EntityInterface<QuestionProps>

export class Question extends Entity<QuestionProps> implements QuestionEntity {
	constructor(props: QuestionProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props: QuestionFactoryProps, id?: string): Question {
		const entityId = UniqueEntityID.create({ value: id });
		const turn = Turn.create({ value: props.turn });
		const body = Body.create({ value: props.body });
		const answerer = User.create({ name: props.answerer.name }, props.answerer.id);
		const createdAt = DateTime.create({ value: props.createdAt });

		return new Question({
			turn,
			body,
			answerer,
			createdAt,
		}, entityId);
	}

	get turn(): Turn {
		return this.props.turn;
	}

	get body(): Body {
		return this.props.body;
	}

	get answerer(): UserEntity {
		return this.props.answerer;
	}

	get createdAt(): DateTime {
		return this.props.createdAt;
	}
}
