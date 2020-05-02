import { AuthenticatorID } from '@server/domains/auth/AuthenticatorID';
import { Token } from '@server/domains/auth/Token';
import { UserEntity } from '@server/domains/user/User';

export interface SessionData {
    token: Token | null;
    authenticatorId: AuthenticatorID | null;
    user: UserEntity | null;
}
