// Library
import mongodb, { FilterQuery } from 'mongodb';

// Mongo
import { MongoRoom } from './models/MongoRoom';
import { MongoParticipant } from './models/MongoParticipant';

// Domains
import { Room, RoomEntity } from '@server/domains/room/Room';
import { RoomRepository, GetRoomOptions, GetParticipantOptions } from '@server/domains/room/RoomRepository';
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
	getParticipant = async ({ roomId, playerId }: GetParticipantOptions): Promise<UserEntity | null> => {
		const room = await this.getRoom({ id: roomId });

		if (!room) {
            throw new Error(`Not found room by ID: ${ roomId.value }`);
		}

		const filteredParticipants = room.participants.filter((participant) => participant.id.isEqualTo(playerId));
		return filteredParticipants[0] || null;
	}

	/**
	 * プレイヤーを追加する
	 */
	addParticipant = async (room: RoomEntity, player: UserEntity): Promise<void> => {
		const mongoRoom = MongoRoom.fromRoom(room);
		const mongoParticipant = MongoParticipant.fromParticipant(player);

		if (await this.getParticipant({ roomId: room.id, playerId: player.id })) {
            throw new Error(`Duplicated player ID: ${ mongoParticipant.id }`);
        }

		await this.roomCollection.update({
			id: mongoRoom.id
		}, {
			$push: {
				participants: mongoParticipant,
			}
		});
	}

	/**
	 * プレイヤーを削除する
	 */
	removeParticipant = async (room: RoomEntity, player: UserEntity): Promise<void> => {
		const mongoRoom = MongoRoom.fromRoom(room);
		const mongoParticipant = MongoParticipant.fromParticipant(player);

		if (!await this.getParticipant({ roomId: room.id, playerId: player.id })) {
            throw new Error(`Not found player ID: ${ mongoParticipant.id }`);
        }

		await this.roomCollection.update({
			id: mongoRoom.id
		}, {
			$pull: {
				participants: {
					id: mongoParticipant.id,
				},
			}
		});
	}
}
