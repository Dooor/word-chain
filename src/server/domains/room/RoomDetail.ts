import { Room } from '@server/domains/room/Room';
import { DateTime } from '@server/domains/core/DateTime';
import { InvitationCode } from '@server/domains/room/RoomDetail/InvitationCode';
import { Capacity } from '@server/domains/room/RoomDetail/Capacity';
import { UserEntity, User } from '@server/domains/user/User';

export interface RoomDetailProps {
	room: Room;
	invitationCode: InvitationCode;
	capacity: Capacity;
	participants: UserEntity[];
	createdAt: DateTime;
}

export interface RoomDetailFactoryProps {
	room: {
		id?: string;
		name: string;
	};
	invitationCode?: string;
	capacity?: number;
	participants?: UserEntity[];
	createdAt?: number;
}

export type RoomDetailEntity = RoomDetailProps & {
	hasContainedUser: (user: User) =>  boolean;
	isEqualTo: (other: RoomDetailEntity | null | undefined) => boolean;
}

export class RoomDetail implements RoomDetailEntity {
	protected readonly props: RoomDetailProps;

	constructor(props: RoomDetailProps) {
		this.props = props;
	}

	static create(props: RoomDetailFactoryProps): RoomDetail {
		const room = Room.create({ name: props.room.name }, props.room.id);
		const invitationCode = InvitationCode.create({ value: props && props.invitationCode });
		const capacity = Capacity.create({ value: props && props.capacity });
		const createdAt = DateTime.create({ value: props && props.createdAt });
		const participants = props && props.participants || [];

		return new RoomDetail({ room, invitationCode, capacity, participants, createdAt });
	}

	get room(): Room {
		return this.props.room;
	}

	get invitationCode(): InvitationCode {
		return this.props.invitationCode;
	}

	get capacity(): Capacity {
		return this.props.capacity;
	}

	get createdAt(): DateTime {
		return this.props.createdAt;
	}

	get participants(): UserEntity[] {
		return this.props.participants;
	}

	hasContainedUser = (user: User): boolean => {
		return this.props.participants.some((participant) => participant.isEqualTo(user));
	}

	isEqualTo = (other: RoomDetailEntity | null | undefined): boolean => {
		return this.room.isEqualTo(other && other.room);
	}
}
