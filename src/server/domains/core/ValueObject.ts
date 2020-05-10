import { shallowEqual } from 'shallow-equal-object';

interface ValueObjectProps {
	[index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
	protected readonly props: T;

	constructor(props: T, protected readonly name) {
		this.props = Object.freeze(props);
	}

	isEqualTo(vo: ValueObject<T> | null | undefined): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		if (vo.props === undefined) {
			return false;
		}

		if (this.name !== vo.name) {
			return false;
		}

		return shallowEqual(this.props, vo.props);
	}
}

export namespace ValueObject {
	export class ArgumentError extends Error {}
}
