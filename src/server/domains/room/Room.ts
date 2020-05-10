import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { RoomName } from '@server/domains/room/Room/Name';

export interface RoomProps {
	name: RoomName;
}

export interface RoomFactoryProps {
	name: string;
}

export type RoomEntity = RoomProps & EntityInterface<RoomProps>

export class Room extends Entity<RoomProps> implements RoomEntity {
	private constructor(props: RoomProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props: RoomFactoryProps, id?: string): Room {
		const name = RoomName.create({ value: props.name });

		return new Room({ name }, UniqueEntityID.create({ value: id }));
	}

	get name(): RoomName {
		return this.props.name;
	}
}
