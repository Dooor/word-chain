import { ValueObject } from '@server/domains/core/ValueObject';

export interface TokenProps {
	value: string;
}

export class Token extends ValueObject<TokenProps> {
	private constructor(props: TokenProps) {
		super(props, 'Token');
	}

	static create = (props: TokenProps): Token => {
		return new Token(props);
	}

	get value(): string {
		return this.props.value.replace('Bearer ', '');
	}

	get isBearer(): boolean {
		return this.props.value.startsWith('Bearer ');
	}
}
