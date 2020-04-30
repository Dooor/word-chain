import { ValueObject } from '@server/domains/core/ValueObject';
import { SecureRandom } from '@server/utils/SecureRandom';

export interface InvitationCodeProps {
	value: string;
}

const InvitationCodeLength = 6;

export class InvitationCode extends ValueObject<InvitationCodeProps> {
	private constructor(props: InvitationCodeProps) {
		super(props);
	}

	static create(props?: Partial<InvitationCodeProps>): InvitationCode {
		const value = props && props.value || SecureRandom.number(InvitationCodeLength);

		if (value.length !== InvitationCodeLength) {
			throw new Error(`Invalid arguments: InvitationCode's length must be ${InvitationCodeLength}, but passed ${value.length}`);
		}

		return new InvitationCode({ value });
	}

	get value(): string {
		return this.props.value;
	}
}
