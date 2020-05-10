// Library
import mongodb, { FilterQuery } from 'mongodb';

// Mongo
import { MongoRoomDetail } from './models/MongoRoomDetail';
import { MongoParticipant } from './models/MongoParticipant';

// Domains
import { RoomDetail, RoomDetailEntity } from '@server/domains/room/RoomDetail';
import { RoomRepository, GetRoomOptions, GetParticipantOptions } from '@server/domains/room/RoomRepository';
import { UserEntity } from '@server/domains/user/User';

export class RoomRepositoryImpl implements RoomRepository {
	private readonly client: mongodb.MongoClient;
    private readonly roomCollection: mongodb.Collection<MongoRoomDetail>;

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
	getRoom = async (options: GetRoomOptions): Promise<RoomDetail | null> => {
		if (!options.id && !options.invitationCode) {
            throw new Error(`Invalid arguments: options must have id or invitationCode`);
		}

		const queries: FilterQuery<MongoRoomDetail>[] = [{
			deletedAt: null,
		}];

		if (options.id) {
			queries.push({ 'room.id': options.id.value });
		}
		if (options.invitationCode) {
			queries.push({ invitationCode: options.invitationCode.value });
		}

		const mongoRoomDetail = await this.roomCollection.findOne({
			$and: queries,
		});

		if (!mongoRoomDetail) {
			return null;
		}

		return MongoRoomDetail.toRoomDetail(mongoRoomDetail);
	}

    /**
     * 部屋を作成する
     */
	createRoom = async (roomDetail: RoomDetailEntity): Promise<void> => {
		const mongoRoomDetail = MongoRoomDetail.fromRoomDetail(roomDetail);

		if (await this.getRoom({ id: roomDetail.room.id })) {
            throw new Error(`Duplicated room ID: ${ mongoRoomDetail.room.id }`);
        }
		if (await this.getRoom({ invitationCode: roomDetail.invitationCode })) {
            throw new Error(`Duplicated invitation code: ${ mongoRoomDetail.invitationCode }`);
        }

        await this.roomCollection.insertOne(mongoRoomDetail);
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
	addParticipant = async (roomDetail: RoomDetailEntity, player: UserEntity): Promise<void> => {
		const mongoRoomDetail = MongoRoomDetail.fromRoomDetail(roomDetail);
		const mongoParticipant = MongoParticipant.fromParticipant(player);

		if (await this.getParticipant({ roomId: roomDetail.room.id, playerId: player.id })) {
            throw new Error(`Duplicated player ID: ${ mongoParticipant.id }`);
        }

		await this.roomCollection.update({
			'room.id': mongoRoomDetail.room.id,
		}, {
			$push: {
				participants: mongoParticipant,
			}
		});
	}

	/**
	 * プレイヤーを削除する
	 */
	removeParticipant = async (roomDetail: RoomDetailEntity, player: UserEntity): Promise<void> => {
		const mongoRoomDetail = MongoRoomDetail.fromRoomDetail(roomDetail);
		const mongoParticipant = MongoParticipant.fromParticipant(player);

		if (!await this.getParticipant({ roomId: roomDetail.room.id, playerId: player.id })) {
            throw new Error(`Not found player ID: ${ mongoParticipant.id }`);
        }

		await this.roomCollection.update({
			'room.id': mongoRoomDetail.room.id
		}, {
			$pull: {
				participants: {
					id: mongoParticipant.id,
				},
			}
		});
	}
}
