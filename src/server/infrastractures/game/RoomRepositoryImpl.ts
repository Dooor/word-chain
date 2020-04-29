
import mongodb, { FilterQuery } from 'mongodb';
import { RoomEntity } from '@server/domains/game/RoomEntity';
import { RoomRepository, GetRoomOptions } from '@server/domains/game/RoomRepository';
import { MongoRoom } from './models/MongoRoom';

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
	getRoom = async (options: GetRoomOptions): Promise<RoomEntity | null> => {
		if (!options.id && !options.invitationCode) {
            throw new Error(`Invalid arguments: options must have id or invitationCode`);
		}

		const queries: FilterQuery<MongoRoom>[] = [{
			deletedAt: null,
		}];

		if (options.id) {
			queries.push({ id: options.id });
		}
		if (options.invitationCode) {
			queries.push({ invitationCode: options.invitationCode });
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

		if (await this.getRoom({ id: mongoRoom.id })) {
            throw new Error(`Duplicated room ID: ${ mongoRoom.id }`);
        }
		if (await this.getRoom({ invitationCode: mongoRoom.invitationCode })) {
            throw new Error(`Duplicated invitation code: ${ mongoRoom.invitationCode }`);
        }

        await this.roomCollection.insertOne(mongoRoom);
	}

}
