import express from 'express';

// Config
import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';

import { SessionData } from '@server/domains/auth/SessionData';

export interface Context {
	session: SessionData;
}

export default async ({ req }: { req: express.Request }): Promise<Context> => {
	const authService = await DI.resolve(Dependencies.AuthService);

	const authorization = req.get('Authorization') || '';
	const session = await authService.authenticate(authorization);

	return { session };
};
