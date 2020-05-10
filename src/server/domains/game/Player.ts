// user
import { User } from '@server/domains/user/User';

// game
import { Turn } from '@server/domains/game/Turn';

export interface PlayerProps {
	user: User;
	turn: Turn;
}

export interface PlayerFactoryProps {
	turn: number;
	user: {
		id: string;
		name: string;
	};
}

export type PlayerEntity = PlayerProps

export class Player implements PlayerEntity {
	protected readonly props: PlayerProps;

	private constructor(props: PlayerProps) {
		this.props = props;
	}

	static create(props: PlayerFactoryProps): Player {
		const turn = Turn.create({ value: props.turn });
		const user = User.create({ name: props.user.name }, props.user.id);

		return new Player({ turn, user });
	}

	get user(): User {
		return this.props.user;
	}

	get turn(): Turn {
		return this.props.turn;
	}

	isEqualTo = (other: PlayerEntity): boolean => {
		return this.user.isEqualTo(other.user);
	}
}
