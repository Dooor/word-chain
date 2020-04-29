import { RoomEntity } from "./RoomEntity";

export interface RoomRepository {
	getRoomById: (id: string) => Promise<RoomEntity | null>;
	createRoom: (room: RoomEntity) => Promise<void>;
}
