// Library
import express from 'express';

// Graphql
import { Context, RequestParameter } from '@server/graphql/context';

// Domains
import { Token } from '@server/domains/auth/Token';

export namespace GraphqlController {
	export function toRequestParameter(callback: (parameter: RequestParameter) => Promise<Context>) {
		return ({ req }: { req: express.Request }) => {
			const authorization = req.get('Authorization') || '';
			const token = Token.create({ value: authorization });

			return callback({ token });
		};
	}
}
