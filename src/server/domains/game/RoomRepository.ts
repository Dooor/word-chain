import { RoomEntity, Room } from "./Room";

export interface GetRoomOptions {
	id?: string;
	invitationCode?: string;
}

export interface RoomRepository {
	getRoom: (options: GetRoomOptions) => Promise<Room | null>;
	createRoom: (room: RoomEntity) => Promise<void>;
}
