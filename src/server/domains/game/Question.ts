import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { PlayerEntity, Player } from '@server/domains/game/Player';

import { Body } from '@server/domains/game/Question/Body';
import { Turn } from '@server/domains/game/Turn';

export interface QuestionProps {
	turn: Turn;
	body: Body;
	answerer: PlayerEntity;
	createdAt: DateTime;
}

export interface QuestionFactoryProps {
	turn: number;
	body: string;
	answerer: {
		turn: number;
		user: {
			id: string;
			name: string;
		};
	};
	createdAt: number;
}

interface QuestionAttributes {
	isLater: (other: QuestionEntity) =>  boolean;
}

export type QuestionEntity = QuestionProps & EntityInterface<QuestionProps> & QuestionAttributes

export class Question extends Entity<QuestionProps> implements QuestionEntity {
	constructor(props: QuestionProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props: QuestionFactoryProps, id?: string): Question {
		const entityId = UniqueEntityID.create({ value: id });
		const turn = Turn.create({ value: props.turn });
		const body = Body.create({ value: props.body });
		const answerer = Player.create({ turn: props.answerer.turn, user: props.answerer.user });
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

	get answerer(): PlayerEntity {
		return this.props.answerer;
	}

	get createdAt(): DateTime {
		return this.props.createdAt;
	}

	isLater = (other: QuestionEntity): boolean => {
		return this.turn.isLater(other.turn);
	}
}
