import { ValueObject } from '@server/domains/core/ValueObject';

export interface AuthenticatorIDProps {
	value: string;
}

export class AuthenticatorID extends ValueObject<AuthenticatorIDProps> {
	private constructor(props: AuthenticatorIDProps) {
		super(props);
	}

	static create = (props: AuthenticatorIDProps): AuthenticatorID => {
		return new AuthenticatorID(props);
	}

	get value(): string {
		return this.props.value;
	}
}
