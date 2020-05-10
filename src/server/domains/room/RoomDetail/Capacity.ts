import { ValueObject } from '@server/domains/core/ValueObject';

export interface CapacityProps {
	value: number;
}

const DefaultCapacity = 2;

export class Capacity extends ValueObject<CapacityProps> {
	private constructor(props: CapacityProps) {
		super(props, 'Capacity');
	}

	static create(props?: Partial<CapacityProps>): Capacity {
		const value = props && (props.value !== undefined) ? props.value : DefaultCapacity;

		if (value <= 0) {
			throw new ValueObject.ArgumentError(`Invalid arguments: Capacity must be greater than 0, but passed ${value}`);
		}

		return new Capacity({ value });
	}

	get value(): number {
		return this.props.value;
	}

	hasSpace = (participantCount: number): boolean => {
		return this.value > participantCount;
	}
}
