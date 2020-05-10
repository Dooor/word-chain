import { DataSource, DataSourceConfig } from 'apollo-datasource';

// Config
import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';

// Domains
import { InvitationCode } from '@server/domains/room/RoomDetail/InvitationCode';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

// Presenters
import { RoomPresenter } from '@server/presentations/room/RoomPresenter';

// Graphql
import { Room as RoomResponse } from '@server/graphql/types';
import { Context } from '@server/graphql/context';

export interface GetRoomParameters {
	roomId?: UniqueEntityID;
	invitationCode?: InvitationCode;
}

export interface JoinRoomParameters {
	invitationCode: InvitationCode;
}

export interface ExitRoomParameters {
	roomId: UniqueEntityID;
}

export interface RoomAPI {
	getRoom: (args: GetRoomParameters) => Promise<RoomResponse | null>;
	createRoom: () => Promise<RoomResponse | null>;
	joinRoom: (args: JoinRoomParameters) => Promise<RoomResponse>;
	exitRoom: (args: ExitRoomParameters) => Promise<RoomResponse>;
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
	getRoom = async ({ roomId, invitationCode }: GetRoomParameters): Promise<RoomResponse | null> => {
		const roomRepository = await DI.resolve(Dependencies.RoomRepository);
		const room = await roomRepository.getRoom({
			id: roomId,
			invitationCode,
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
		const ownerService = await DI.resolve(Dependencies.OwnerService);

		const room = await ownerService.createRoom(this.context.session);

		return RoomPresenter.toResponse(room);
	}

	/**
	 * 部屋に参加する
	 */
	joinRoom = async ({ invitationCode }: JoinRoomParameters): Promise<RoomResponse> => {
		const participantService = await DI.resolve(Dependencies.ParticipantService);

		const room = await participantService.joinRoom(invitationCode, this.context.session);

		return RoomPresenter.toResponse(room);
	}


	/**
	 * 部屋から退出する
	 */
	exitRoom = async ({ roomId }: ExitRoomParameters): Promise<RoomResponse> => {
		const participantService = await DI.resolve(Dependencies.ParticipantService);

		const room = await participantService.exitRoom(roomId, this.context.session);

		return RoomPresenter.toResponse(room);
	}
}
