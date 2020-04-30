import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

export abstract class Entity<T> {
	readonly id: UniqueEntityID;
	protected props: T;

	constructor(props: T, id?: UniqueEntityID) {
		this.id = id ? id : UniqueEntityID.create();
		this.props = props;
	}

	isEqualTo = (object?: Entity<T>): boolean => {
		const isEntity = (v: any): v is Entity<any> => {
			return v instanceof Entity;
		};

		if (object === null || object === undefined) {
			return false;
		}

		if (this === object) {
			return true;
		}

		if (!isEntity(object)) {
			return false;
		}

		return this.id === object.id;
	}
}
