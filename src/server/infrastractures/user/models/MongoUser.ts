
import { User, UserEntity } from '@server/domains/user/User';
import { DateTime } from '@server/domains/core/DateTime';
import { AuthenticatorID } from '@server/domains/auth/AuthenticatorID';

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
			name: mongoUser.user.name,
		}, mongoUser.user.id);
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
