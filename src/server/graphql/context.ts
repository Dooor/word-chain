import express from 'express';

// Config
import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';

import { UserEntity } from '@server/domains/user/User';
import { AuthenticatorID } from '@server/domains/auth/AuthenticatorID';
import { Token } from '@server/domains/auth/Token';

export interface SessionData {
    token: Token | null;
    authenticatorId: AuthenticatorID | null;
    user: UserEntity | null;
}

export interface Context {
	session: SessionData;
}

export default async ({ req }: { req: express.Request }): Promise<Context> => {
	const authService = await DI.resolve(Dependencies.AuthService);
	const userRepository = await DI.resolve(Dependencies.UserRepository);

	const authorization = req.get('Authorization') || '';
    if (!authorization.startsWith('Bearer ')) {
		return {
			session: {
				token: null,
				authenticatorId: null,
				user: null,
			},
		};
    }

	const token = Token.create({ value: authorization.replace('Bearer ', '') }); // FIXME

	const authenticatorId = await authService.authenticate(token);
	const user = authenticatorId ? await userRepository.getUserByAuthenticatorId(authenticatorId) : null;

	return {
		session: {
			token,
			authenticatorId,
			user,
		},
	};
};
