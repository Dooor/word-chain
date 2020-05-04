import { shallowEqual } from 'shallow-equal-object';

interface ValueObjectProps {
	[index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
	protected readonly props: T;

	constructor(props: T) {
		this.props = Object.freeze(props);
	}

	isEqualTo(vo?: ValueObject<T>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		if (vo.props === undefined) {
			return false;
		}

		return shallowEqual(this.props, vo.props);
	}
}

export namespace ValueObject {
	export class ArgumentError extends Error {}
}
