// Domains
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/game/InvitationCode';

// Datasources
import {
	GetRoomParameters,
	ExitRoomParameters,
	JoinRoomParameters,
} from '@server/datasources/game';

// Types
import {
	QueryRoomArgs,
	MutationJoinRoomArgs,
	MutationExitRoomArgs,
} from '@server/graphql/types';

export namespace RoomController {
	export function toGetRoomParameter(args: QueryRoomArgs): GetRoomParameters {
		return {
			roomId: args.id ? UniqueEntityID.create({ value: args.id }) : undefined,
			invitationCode: args.invitationCode ? InvitationCode.create({ value: args.invitationCode }) : undefined,
		};
	}

	export function toExitRoomParameter(args: MutationExitRoomArgs): ExitRoomParameters {
		return {
			roomId: UniqueEntityID.create({ value: args.roomId }),
		};
	}

	export function toJoinRoomParameter(args: MutationJoinRoomArgs): JoinRoomParameters {
		return {
			invitationCode: InvitationCode.create({ value: args.invitationCode }),
		};
	}
}
