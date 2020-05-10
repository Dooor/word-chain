import { DataSource, DataSourceConfig } from 'apollo-datasource';

// Config
import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';

// Domains
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

// Presenters
import { GamePresenter } from '@server/presentations/game/GamePresenter';

// Graphql
import { Game as GameResponse } from '@server/graphql/types';
import { Context } from '@server/graphql/context';

export interface CreateGameParameters {
	roomId: UniqueEntityID;
}

export interface GameAPI {
	createGame: (args: CreateGameParameters) => Promise<GameResponse>;
}

export class GameAPIImpl extends DataSource implements GameAPI {
	private context: Context = { session: { token: null, authenticatorId: null, user: null } };

	initialize = (config: DataSourceConfig<Context>): void => {
		this.context = config.context;
	}

	/**
	 * ゲームを作成する
	 */
	createGame = async ({ roomId }: CreateGameParameters): Promise<GameResponse> => {
		const ownerService = await DI.resolve(Dependencies.OwnerService);

		const game = await ownerService.createGame(roomId, this.context.session);

		return GamePresenter.toResponse(game);
	}
}
