import { ValueObject } from '@server/domains/core/ValueObject';

export interface PlayerCountProps {
	value: number;
}

const DefaultPlayerCount = 2;

export class PlayerCount extends ValueObject<PlayerCountProps> {
	private constructor(props: PlayerCountProps) {
		super(props);
	}

	static create(props?: Partial<PlayerCountProps>): PlayerCount {
		const value = props && props.value || DefaultPlayerCount;

		if (value <= 0) {
			throw new Error(`Invalid arguments: PlayerCount must be greater than 0, but passed ${value}`);
		}

		return new PlayerCount({ value });
	}

	get value(): number {
		return this.props.value;
	}
}
