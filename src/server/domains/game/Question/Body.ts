import { ValueObject } from '@server/domains/core/ValueObject';

export interface BodyProps {
	value: string;
}

export class Body extends ValueObject<BodyProps> {
	private constructor(props: BodyProps) {
		super(props, 'QuestionBody');
	}

	static create(props: BodyProps): Body {
		if (props.value.length !== 1) {
			throw new ValueObject.ArgumentError(`Invalid arguments: Body's length must not be one`);
		}

		return new Body({ value: props.value });
	}

	get value(): string {
		return this.props.value;
	}
}
