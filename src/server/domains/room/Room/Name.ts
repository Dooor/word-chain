import { ValueObject } from '@server/domains/core/ValueObject';

export interface RoomNameProps {
	value: string;
}

export class RoomName extends ValueObject<RoomNameProps> {
	private constructor(props: RoomNameProps) {
		super(props, 'RoomName');
	}

	static create(props: RoomNameProps): RoomName {
		if (!props.value) {
			throw new ValueObject.ArgumentError(`Invalid arguments: RoomName is not allowed to be blank`);
		}

		return new RoomName({ value: props.value });
	}

	get value(): string {
		return this.props.value;
	}
}
