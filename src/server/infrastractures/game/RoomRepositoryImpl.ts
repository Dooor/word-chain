
import mongodb, { FilterQuery } from 'mongodb';
import { Room, RoomEntity } from '@server/domains/game/Room';
import { RoomRepository, GetRoomOptions, GetPlayerOptions } from '@server/domains/game/RoomRepository';
import { MongoRoom } from './models/MongoRoom';
import { MongoPlayer } from './models/MongoPlayer';
import { UserEntity } from '@server/domains/user/User';

export class RoomRepositoryImpl implements RoomRepository {
	private readonly client: mongodb.MongoClient;
    private readonly roomCollection: mongodb.Collection<MongoRoom>;

	constructor(client: mongodb.MongoClient, dbName: string) {
		this.client = client;
		this.roomCollection = this.client.db(dbName).collection('rooms');
	}

    async close(): Promise<void> {
        await this.client.close();
    }

	/**
     * 部屋を取得する
	 * @return 部屋。存在しない場合はnullを返す
     */
	getRoom = async (options: GetRoomOptions): Promise<Room | null> => {
		if (!options.id && !options.invitationCode) {
            throw new Error(`Invalid arguments: options must have id or invitationCode`);
		}

		const queries: FilterQuery<MongoRoom>[] = [{
			deletedAt: null,
		}];

		if (options.id) {
			queries.push({ id: options.id.value });
		}
		if (options.invitationCode) {
			queries.push({ invitationCode: options.invitationCode.value });
		}

		const mongoRoom = await this.roomCollection.findOne({
			$and: queries,
		});

		if (!mongoRoom) {
			return null;
		}

		return MongoRoom.toRoom(mongoRoom);
	}

    /**
     * 部屋を作成する
     */
	createRoom = async (room: RoomEntity): Promise<void> => {
		const mongoRoom = MongoRoom.fromRoom(room);

		if (await this.getRoom({ id: room.id })) {
            throw new Error(`Duplicated room ID: ${ mongoRoom.id }`);
        }
		if (await this.getRoom({ invitationCode: room.invitationCode })) {
            throw new Error(`Duplicated invitation code: ${ mongoRoom.invitationCode }`);
        }

        await this.roomCollection.insertOne(mongoRoom);
	}

	/**
	 * プレイヤーを取得する
	 * @return プレイヤー。見つからない場合はnullを返す。
	 */
	getPlayer = async ({ roomId, playerId }: GetPlayerOptions): Promise<UserEntity | null> => {
		const room = await this.getRoom({ id: roomId });

		if (!room) {
            throw new Error(`Not found room by ID: ${ roomId.value }`);
		}

		const filteredPlayers = room.players.filter((player) => player.id.isEqualTo(playerId));
		return filteredPlayers[0] || null;
	}

	/**
	 * プレイヤーを追加する
	 */
	addPlayer = async (room: RoomEntity, player: UserEntity): Promise<void> => {
		const mongoRoom = MongoRoom.fromRoom(room);
		const mongoPlayer = MongoPlayer.fromPlayer(player);

		if (await this.getPlayer({ roomId: room.id, playerId: player.id })) {
            throw new Error(`Duplicated player ID: ${ mongoPlayer.id }`);
        }

		await this.roomCollection.update({
			id: mongoRoom.id
		}, {
			$push: {
				players: mongoPlayer,
			}
		});
	}

	/**
	 * プレイヤーを削除する
	 */
	removePlayer = async (room: RoomEntity, player: UserEntity): Promise<void> => {
		const mongoRoom = MongoRoom.fromRoom(room);
		const mongoPlayer = MongoPlayer.fromPlayer(player);

		if (!await this.getPlayer({ roomId: room.id, playerId: player.id })) {
            throw new Error(`Not found player ID: ${ mongoPlayer.id }`);
        }

		await this.roomCollection.update({
			id: mongoRoom.id
		}, {
			$pull: {
				players: {
					id: mongoPlayer.id,
				},
			}
		});
	}
}
