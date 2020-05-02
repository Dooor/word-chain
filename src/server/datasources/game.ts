import { DataSource, DataSourceConfig } from 'apollo-datasource';

// Config
import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';

// Domains
import { RoomEntity, Room } from '@server/domains/game/Room';
import { InvitationCode } from '@server/domains/game/InvitationCode';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

// Presenters
import { RoomPresenter } from '@server/presenters/game/RoomPresenter';

// Graphql
import { Room as RoomResponse } from '@server/graphql/types';
import { Context } from '@server/graphql/context';

// Utils
import { Logger } from '@server/utils/Logger';

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

		const paramId = id ? UniqueEntityID.create({ value: id }) : undefined;
		const paramInvitationCode = invitationCode ? InvitationCode.create({ value: invitationCode }) : undefined;

		const room = await roomRepository.getRoom({
			id: paramId,
			invitationCode: paramInvitationCode,
		});

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

		const room: RoomEntity = Room.create();

		try {
			await roomRepository.createRoom(room);
		} catch (error) {
			Logger.captureException(error);
			return null;
		}

		return RoomPresenter.toResponse(room);
	}
}
