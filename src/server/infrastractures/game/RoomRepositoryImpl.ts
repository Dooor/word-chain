
import mongodb from 'mongodb';
import { RoomEntity } from '@server/domains/game/RoomEntity';
import { RoomRepository } from '@server/domains/game/RoomRepository';
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

	getRoomById = async (id: string): Promise<RoomEntity | null> => {
		const mongoRoom = await this.roomCollection.findOne({
			id,
			deletedAt: null,
		});

		if (!mongoRoom) {
			return null;
		}

		return MongoRoom.toRoom(mongoRoom);
	}

	getRoomByInvitationCode = async (invitationCode: string): Promise<RoomEntity | null> => {
		const mongoRoom = await this.roomCollection.findOne({
			invitationCode,
			deletedAt: null,
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

		if (await this.getRoomById(mongoRoom.id)) {
            throw new Error(`Duplicated room ID: ${ mongoRoom.id }`);
        }
		if (await this.getRoomByInvitationCode(mongoRoom.invitationCode)) {
            throw new Error(`Duplicated invitation code: ${ mongoRoom.invitationCode }`);
        }

        await this.roomCollection.insertOne(mongoRoom);
	}

}
