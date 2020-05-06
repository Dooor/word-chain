import { ValueObject } from '@server/domains/core/ValueObject';

export interface PlayerCountProps {
	value: number;
}

const DefaultPlayerCount = 2;

export class PlayerCount extends ValueObject<PlayerCountProps> {
	private constructor(props: PlayerCountProps) {
		super(props, 'PlayerCount');
	}

	static create(props?: Partial<PlayerCountProps>): PlayerCount {
		const value = props && (props.value !== undefined) ? props.value : DefaultPlayerCount;

		if (value <= 0) {
			throw new ValueObject.ArgumentError(`Invalid arguments: PlayerCount must be greater than 0, but passed ${value}`);
		}

		return new PlayerCount({ value });
	}

	get value(): number {
		return this.props.value;
	}
}
