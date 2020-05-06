import { ValueObject } from '@server/domains/core/ValueObject';

export interface WordProps {
	value: string;
}

export interface WordAttributes extends WordProps {
	initial: string;
	final: string;
}

export class Word extends ValueObject<WordProps> implements WordAttributes {
	private constructor(props: WordProps) {
		super(props, 'AnswerWord');
	}

	static create(props: WordProps): Word {
		if (props.value === '') {
			throw new ValueObject.ArgumentError(`Invalid arguments: Word must not be blank`);
		}
		if (props.value.length <= 1) {
			throw new ValueObject.ArgumentError(`Invalid arguments: Word must not contains over 2 spells`);
		}

		return new Word({ value: props.value });
	}

	get value(): string {
		return this.props.value;
	}

	get initial(): string {
		return this.props.value[0];
	}

	get final(): string {
		return this.props.value[this.props.value.length - 1];
	}
}
