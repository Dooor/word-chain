import { ValueObject } from '@server/domains/core/ValueObject';

export interface UserNameProps {
	value: string;
}

export class UserName extends ValueObject<UserNameProps> {
	private constructor(props: UserNameProps) {
		super(props, 'UserName');
	}

	static create(props: UserNameProps): UserName {
		if (props.value.length <= 0) {
			throw new ValueObject.ArgumentError(`Invalid arguments: UserName's length must be greater than 0, but passed ${props.value.length}`);
		}

		return new UserName(props);
	}

	get value(): string {
		return this.props.value;
	}
}
