import { DataSource, DataSourceConfig } from 'apollo-datasource';

import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';
import { RoomEntity } from '@server/domains/game/RoomEntity';

import { SecureRandom } from '@server/utils/SecureRandom';
import { UnixTimestamp } from '@server/utils/UnixTimestamp';

export interface RoomAPI {
	getRoom: (id?: string, invitationCode?: string) => Promise<RoomEntity | null>;
	createRoom: () => Promise<RoomEntity | null>;
}

export class RoomAPIImpl extends DataSource implements RoomAPI {
	private context = {};

	initialize = (config: DataSourceConfig<{}>): void => {
		this.context = config.context;
	}

	/**
	 * 部屋ID/招待コードを指定して、部屋を取得する
	 * @return 部屋。部屋が見つからない場合はnullを返す。
	 */
	getRoom = async (id?: string, invitationCode?: string): Promise<RoomEntity | null> => {
		const roomRepository = await DI.resolve(Dependencies.RoomRepository);

		return await roomRepository.getRoom({ id, invitationCode });
	}

	/**
	 * 部屋を作成する
	 */
	createRoom = async (): Promise<RoomEntity | null> => {
		const roomRepository = await DI.resolve(Dependencies.RoomRepository);

		const room: RoomEntity = {
			id: SecureRandom.uuid(),
			invitationCode: SecureRandom.number(6),
			createdAt: UnixTimestamp.now(),
			playerCount: 2,
		};

		try {
			await roomRepository.createRoom(room);
		} catch (error) {
			console.error(error);
			return null;
		}

		return room;

	}
}
