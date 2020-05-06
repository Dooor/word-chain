import validator from 'validator';

import { ValueObject } from '@server/domains/core/ValueObject';
import { SecureRandom } from '@server/utils/SecureRandom';

export interface UniqueEntityIDProps {
	value: string;
}

export class UniqueEntityID extends ValueObject<UniqueEntityIDProps> {
	private constructor(props: UniqueEntityIDProps) {
		super(props, 'UniqueEntityID');
	}

	static create = (props?: Partial<UniqueEntityIDProps>): UniqueEntityID => {
		const value = props && props.value || SecureRandom.uuid();

		if (!validator.isUUID(value)) {
			throw new ValueObject.ArgumentError(`Invalid arguments: UniqueEntityID must be uuid, but passed ${value}`);
		}

		return new UniqueEntityID({ value });
	}

	get value(): string {
		return this.props.value;
	}
}
