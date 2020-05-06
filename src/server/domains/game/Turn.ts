import { ValueObject } from '@server/domains/core/ValueObject';

export interface TurnProps {
	value: number;
}

export class Turn extends ValueObject<TurnProps> {
	private constructor(props: TurnProps) {
		super(props, 'Turn');
	}

	static create(props: TurnProps): Turn {
		if (props.value < 0) {
			throw new ValueObject.ArgumentError(`Invalid arguments: Turn must not be greater than 0, but passed ${props.value}`);
		}

		return new Turn({ value: props.value });
	}

	get value(): number {
		return this.props.value;
	}
}
