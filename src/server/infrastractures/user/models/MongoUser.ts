
import { User, UserEntity } from '@server/domains/user/User';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { AuthenticatorID } from '@server/domains/auth/AuthenticatorID';
import { UserName } from '@server/domains/user/UserName';

export interface MongoUser {
    readonly authenticatorId: string;
	readonly user: {
		id: string;
		name: string;
	};
	readonly createdAt: number;
	readonly deletedAt: number | null;
}

export namespace MongoUser {
    export function toUser(mongoUser: MongoUser): UserEntity {
        return User.create({
			name: UserName.create({ value: mongoUser.user.name }),
		}, UniqueEntityID.create({ value: mongoUser.user.id }));
    }

    export function fromUser(authenticatorId: AuthenticatorID, user: UserEntity): MongoUser {
        return {
			authenticatorId: authenticatorId.value,
			user: {
				id: user.id.value,
				name: user.name.value
			},
			createdAt: DateTime.create().value,
			deletedAt: null,
        };
    }
}
