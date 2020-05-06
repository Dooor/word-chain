// Config
import { Dependencies } from '@server/config/Config';
import { DI } from '@server/config/DIUtils';

import { SessionData } from '@server/domains/auth/SessionData';
import { Token } from '@server/domains/auth/Token';

import { GraphqlController } from '@server/presentations/graphql/GraphqlController';

export interface Context {
	session: SessionData;
}

export interface RequestParameter {
	token: Token;
}

const context = async ({ token }: RequestParameter): Promise<Context> => {
	const authService = await DI.resolve(Dependencies.AuthService);
	const session = await authService.authenticate(token);
	return { session };
};

export default GraphqlController.toRequestParameter(context);

