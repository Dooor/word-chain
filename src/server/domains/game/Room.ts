import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/game/InvitationCode';
import { PlayerCount } from '@server/domains/game/PlayerCount';

export interface RoomProps {
	invitationCode: InvitationCode;
	playerCount: PlayerCount;
	createdAt: DateTime;
}

export type RoomEntity = RoomProps & EntityInterface<RoomProps>

export class Room extends Entity<RoomProps> implements RoomEntity {
	private constructor(props: RoomProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props?: { invitationCode?: string; playerCount?: number; createdAt?: number }, id?: string): Room {
		const invitationCode = InvitationCode.create({ value: props && props.invitationCode });
		const playerCount = PlayerCount.create({ value: props && props.playerCount });
		const createdAt = DateTime.create({ value: props && props.createdAt });

		return new Room({ invitationCode, playerCount, createdAt }, UniqueEntityID.create({ value: id }));
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
