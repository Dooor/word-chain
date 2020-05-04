// Library
import { UserInputError } from 'apollo-server';

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
		try {
			return {
				roomId: args.id ? UniqueEntityID.create({ value: args.id }) : undefined,
				invitationCode: args.invitationCode ? InvitationCode.create({ value: args.invitationCode }) : undefined,
			};
		} catch (error) {
			throw new UserInputError(error.message, args);
		}
	}

	export function toExitRoomParameter(args: MutationExitRoomArgs): ExitRoomParameters {
		try {
			return {
				roomId: UniqueEntityID.create({ value: args.roomId }),
			};
		} catch (error) {
			throw new UserInputError(error.message, args);
		}
	}

	export function toJoinRoomParameter(args: MutationJoinRoomArgs): JoinRoomParameters {
		try {
			return {
				invitationCode: InvitationCode.create({ value: args.invitationCode }),
			};
		} catch (error) {
			throw new UserInputError(error.message, args);
		}
	}
}
