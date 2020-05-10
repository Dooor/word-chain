import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/room/InvitationCode';
import { PlayerCount } from '@server/domains/room/PlayerCount';
import { UserEntity, User } from '@server/domains/user/User';

export interface RoomProps {
	invitationCode: InvitationCode;
	playerCount: PlayerCount;
	participants: UserEntity[];
	createdAt: DateTime;
}

export interface RoomFactoryProps {
	invitationCode?: string;
	playerCount?: number;
	participants?: UserEntity[];
	createdAt?: number;
}

export type RoomEntity = RoomProps & EntityInterface<RoomProps> & {
	hasContainedUser: (user: User) =>  boolean;
}

export class Room extends Entity<RoomProps> implements RoomEntity {
	private constructor(props: RoomProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props?: RoomFactoryProps, id?: string): Room {
		const invitationCode = InvitationCode.create({ value: props && props.invitationCode });
		const playerCount = PlayerCount.create({ value: props && props.playerCount });
		const createdAt = DateTime.create({ value: props && props.createdAt });
		const participants = props && props.participants || [];

		return new Room({ invitationCode, playerCount, participants, createdAt }, UniqueEntityID.create({ value: id }));
	}

	get invitationCode(): InvitationCode {
		return this.props.invitationCode;
	}

	get playerCount(): PlayerCount {
		return this.props.playerCount;
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
}
