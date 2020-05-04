import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { AuthenticationError } from 'apollo-server';

// Config
import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';

// Domains
import { UserEntity, User } from '@server/domains/user/User';

// Presenters
import { UserPresenter } from '@server/presentations/user/UserPresenter';

// Graphql
import { User as UserResponse } from '@server/graphql/types';
import { Context } from '@server/graphql/context';


export interface UserAPI {
	createUser: () => Promise<UserResponse | null>;
}

export class UserAPIImpl extends DataSource implements UserAPI {
	private context: Context = { session: { token: null, authenticatorId: null, user: null } };

	initialize = (config: DataSourceConfig<Context>): void => {
		this.context = config.context;
	}

	/**
	 * ユーザーを作成する
	 */
	createUser = async (): Promise<UserResponse | null> => {
		if (!this.context.session.authenticatorId) {
			throw new AuthenticationError('token is invalid');
		}

		const userRepository = await DI.resolve(Dependencies.UserRepository);

		const user: UserEntity = User.create({
			name: 'Shiritori',
		});

		await userRepository.createUser(this.context.session.authenticatorId, user);

		return UserPresenter.toResponse(user);
	}
}
