// Library
import { UserInputError } from 'apollo-server';

// Domains
import { ValueObject } from '@server/domains/core/ValueObject';
import { UniqueEntityID } from '@server/domains/core/UniqueEntityID';

// Datasources
import {
	CreateGameParameters,
} from '@server/datasources/game';

// Types
import {
	MutationCreateGameArgs,
} from '@server/graphql/types';

export namespace GameController {
	export function toCreateGameParameter(args: MutationCreateGameArgs): CreateGameParameters {
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
}
