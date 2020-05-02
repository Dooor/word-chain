import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { UserName } from '@server/domains/user/UserName';

export interface UserProps {
	name: UserName;
}

export type UserEntity = UserProps & EntityInterface<UserProps>;

export class User extends Entity<UserProps> implements UserEntity {
	private constructor(props: UserProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props: { name: string }, id?: string): User {
		const name = UserName.create({ value: props.name });
		const uniqueId = UniqueEntityID.create({ value: id });

		return new User({ name }, uniqueId);
	}

	get name(): UserName {
		return this.props.name;
	}
}
