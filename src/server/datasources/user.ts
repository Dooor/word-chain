import { DataSource, DataSourceConfig } from 'apollo-datasource';

// Config
import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';

// Domains
import { UserEntity, User } from '@server/domains/user/User';
import { UserName } from '@server/domains/user/UserName';

// Presenters
import { UserPresenter } from '@server/presenters/user/UserPresenter';

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
			throw new Error('Unauthorized');
		}

		const userRepository = await DI.resolve(Dependencies.UserRepository);

		const user: UserEntity = User.create({
			name: UserName.create({ value: 'Shiritori' }),
		});

		await userRepository.createUser(this.context.session.authenticatorId, user);

		return UserPresenter.toResponse(user);
	}
}
