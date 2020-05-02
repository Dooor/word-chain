import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

export interface EntityInterface<T> {
	id: UniqueEntityID;
	isEqualTo: (object: Entity<T> | null | undefined) => boolean;
}

export abstract class Entity<T> implements EntityInterface<T> {
	protected _id: UniqueEntityID;
	protected props: T;

	constructor(props: T, id?: UniqueEntityID) {
		this._id = id ? id : UniqueEntityID.create();
		this.props = props;
	}

	get id(): UniqueEntityID {
		return this._id;
	}

	isEqualTo = (object: Entity<T> | null | undefined): boolean => {
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
