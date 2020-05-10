// core
import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

// game
import { QuestionEntity } from '@server/domains/game/Question';
import { PlayerEntity } from '@server/domains/game/Player';

// room
import { RoomEntity, Room } from '@server/domains/room/Room';

export interface GameProps {
	room: RoomEntity;
	players: PlayerEntity[];
	questions: QuestionEntity[];
	createdAt: DateTime;
}

export interface GameFactoryProps {
	room: {
		id: string;
		name: string;
	};
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
		const room = Room.create({ name: props.room.name }, props.room.id);
		const players = props.players;
		const questions = props.questions || [];
		const createdAt = DateTime.create({ value: props && props.createdAt });

		return new Game({ room, players, questions, createdAt }, UniqueEntityID.create({ value: id }));
	}

	get room(): RoomEntity {
		return this.props.room;
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
