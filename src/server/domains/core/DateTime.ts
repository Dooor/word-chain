import { ValueObject } from '@server/domains/core/ValueObject';
import { UnixTimestamp } from '@server/utils/UnixTimestamp';

export interface DateTimeProps {
	value: number;
}

export class DateTime extends ValueObject<DateTimeProps> {
	private constructor(props: DateTimeProps) {
		super(props);
	}

	static create = (props?: Partial<DateTimeProps>): DateTime => {
		const value = props && props.value || UnixTimestamp.now();

		return new DateTime({ value });
	}

	get value(): number {
		return this.props.value;
	}
}
