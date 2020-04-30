import { DataSource, DataSourceConfig } from 'apollo-datasource';

// Config
import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';

// Domains
import { DateTime } from '@server/domains/core/DateTime';
import { RoomEntity, Room } from '@server/domains/game/Room';
import { InvitationCode } from '@server/domains/game/InvitationCode';
import { PlayerCount } from '@server/domains/game/PlayerCount';

// Presenters
import { RoomPresenter } from '@server/presenters/game/RoomPresenter';

// Graphql
import { Room as RoomResponse } from '@server/graphql/types';
import { Context } from '@server/graphql/context';


export interface RoomAPI {
	getRoom: (id?: string, invitationCode?: string) => Promise<RoomResponse | null>;
	createRoom: () => Promise<RoomResponse | null>;
}

export class RoomAPIImpl extends DataSource implements RoomAPI {
	private context: Context = { session: { token: null, authenticatorId: null, user: null } };

	initialize = (config: DataSourceConfig<Context>): void => {
		this.context = config.context;
	}

	/**
	 * 部屋ID/招待コードを指定して、部屋を取得する
	 * @return 部屋。部屋が見つからない場合はnullを返す。
	 */
	getRoom = async (id?: string, invitationCode?: string): Promise<RoomResponse | null> => {
		const roomRepository = await DI.resolve(Dependencies.RoomRepository);

		const room = await roomRepository.getRoom({ id, invitationCode });

		if (!room) {
			return null;
		}

		return RoomPresenter.toResponse(room);
	}

	/**
	 * 部屋を作成する
	 */
	createRoom = async (): Promise<RoomResponse | null> => {
		const roomRepository = await DI.resolve(Dependencies.RoomRepository);

		const room: RoomEntity = Room.create({
			invitationCode: InvitationCode.create(),
			createdAt: DateTime.create(),
			playerCount: PlayerCount.create(),
		});

		try {
			await roomRepository.createRoom(room);
		} catch (error) {
			console.error(error);
			return null;
		}

		return RoomPresenter.toResponse(room);
	}
}
