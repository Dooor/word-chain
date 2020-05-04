import { UserEntity } from '@server/domains/user/User';
import { User as UserResponse } from '@server/graphql/types';

export namespace UserPresenter {
	export function toResponse(user: UserEntity): UserResponse {
		return {
			id: user.id.value,
			name: user.name.value,
		};
	}
}
