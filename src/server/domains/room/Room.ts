import { Entity, EntityInterface } from '@server/domains/core/Entity';
import { DateTime } from '@server/domains/core/DateTime';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/room/InvitationCode';
import { PlayerCount } from '@server/domains/room/PlayerCount';
import { UserEntity } from '@server/domains/user/User';

export interface RoomProps {
	invitationCode: InvitationCode;
	playerCount: PlayerCount;
	players: UserEntity[];
	createdAt: DateTime;
}

export type RoomEntity = RoomProps & EntityInterface<RoomProps>

export class Room extends Entity<RoomProps> implements RoomEntity {
	private constructor(props: RoomProps, id?: UniqueEntityID) {
		super(props, id);
	}

	static create(props?: { invitationCode?: string; playerCount?: number; players?: UserEntity[]; createdAt?: number }, id?: string): Room {
		const invitationCode = InvitationCode.create({ value: props && props.invitationCode });
		const playerCount = PlayerCount.create({ value: props && props.playerCount });
		const createdAt = DateTime.create({ value: props && props.createdAt });
		const players = props && props.players || [];

		return new Room({ invitationCode, playerCount, players, createdAt }, UniqueEntityID.create({ value: id }));
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

	get players(): UserEntity[] {
		return this.props.players;
	}
}