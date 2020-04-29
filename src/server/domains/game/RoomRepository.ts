import { RoomEntity } from "./RoomEntity";

export interface GetRoomOptions {
	id?: string;
	invitationCode?: string;
}

export interface RoomRepository {
	getRoom: (options: GetRoomOptions) => Promise<RoomEntity | null>;
	createRoom: (room: RoomEntity) => Promise<void>;
}
