import { Entity } from '@server/domains/core/Entity';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/game/InvitationCode';
import { PlayerCount } from '@server/domains/game/PlayerCount';

export interface RoomProps {
	invitationCode: InvitationCode;
	playerCount: PlayerCount;
	createdAt: DateTime;
}

export interface RoomEntity extends RoomProps{
	id: UniqueEntityID;
}

export class Room extends Entity<RoomProps> implements RoomEntity {
	private constructor(props: RoomProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props: RoomProps, id?: UniqueEntityID): Room {
		return new Room(props, id);
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
}
