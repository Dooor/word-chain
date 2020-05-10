// Library
import { UserInputError } from 'apollo-server';

// Domains
import { ValueObject } from '@server/domains/core/ValueObject';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';
import { InvitationCode } from '@server/domains/room/RoomDetail/InvitationCode';
import { RoomName } from '@server/domains/room/Room/Name';
import { Capacity } from '@server/domains/room/RoomDetail/Capacity';

// Datasources
import {
	GetRoomParameters,
	ExitRoomParameters,
	JoinRoomParameters,
	CreateRoomParameters,
} from '@server/datasources/room';

// Types
import {
	QueryRoomArgs,
	MutationJoinRoomArgs,
	MutationExitRoomArgs,
	MutationCreateRoomArgs,
} from '@server/graphql/types';

export namespace RoomController {
	export function toGetRoomParameter(args: QueryRoomArgs): GetRoomParameters {
		try {
			return {
				roomId: args.id ? UniqueEntityID.create({ value: args.id }) : undefined,
				invitationCode: args.invitationCode ? InvitationCode.create({ value: args.invitationCode }) : undefined,
			};
		} catch (error) {
			if (error instanceof ValueObject.ArgumentError) {
				throw new UserInputError(error.message, args);
			}

			throw error;
		}
	}

	export function toCreateRoomParameter(args: MutationCreateRoomArgs): CreateRoomParameters {
		try {
			return {
				name: RoomName.create({ value: args.name }),
				capacity: Capacity.create({ value: args.capacity }),
			};
		} catch (error) {
			if (error instanceof ValueObject.ArgumentError) {
				throw new UserInputError(error.message, args);
			}

			throw error;
		}
	}

	export function toExitRoomParameter(args: MutationExitRoomArgs): ExitRoomParameters {
		try {
			return {
				roomId: UniqueEntityID.create({ value: args.roomId }),
			};
		} catch (error) {
			if (error instanceof ValueObject.ArgumentError) {
				throw new UserInputError(error.message, args);
			}

			throw error;
		}
	}

	export function toJoinRoomParameter(args: MutationJoinRoomArgs): JoinRoomParameters {
		try {
			return {
				invitationCode: InvitationCode.create({ value: args.invitationCode }),
			};
		} catch (error) {
			if (error instanceof ValueObject.ArgumentError) {
				throw new UserInputError(error.message, args);
			}

			throw error;
		}
	}
}
