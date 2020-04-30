import { Entity } from '@server/domains/core/Entity';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { UserName } from '@server/domains/user/UserName';

export interface UserProps {
	name: UserName;
}

export interface UserEntity extends UserProps{
	id: UniqueEntityID;
}

export class User extends Entity<UserProps> implements UserEntity {
	private constructor(props: UserProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props: UserProps, id?: UniqueEntityID): User {
		return new User(props, id);
	}

	get name(): UserName {
		return this.props.name;
	}
}
