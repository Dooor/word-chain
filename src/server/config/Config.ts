
import mongodb, { MongoClient } from 'mongodb';
import { DI } from './DIUtils';

// Services
import { AuthService } from '@server/services/AuthService/AuthService';
import { MockAuthService } from '@server/services/AuthService/MockAuthService';

// Repositories
import { RoomRepository } from '@server/domains/game/RoomRepository';
import { RoomRepositoryImpl } from '@server/infrastractures/game/RoomRepositoryImpl';
import { UserRepository } from '@server/domains/user/UserRepository';
import { UserRepositoryImpl } from '@server/infrastractures/user/UserRepositoryImpl';

const Config = {
    db: {
        url: 'mongodb://root:root@localhost:27017/word-chain-db'
    }
};

export const Dependencies = {
	Config: DI.Dependency<typeof Config>(),
	AuthService: DI.Dependency<AuthService>(),
	RoomRepository: DI.Dependency<RoomRepository>(),
	UserRepository: DI.Dependency<UserRepository>(),
    MongoClient: DI.Dependency<mongodb.MongoClient>()
};

DI.register(Dependencies.Config, async () => Config);

/**
 * Services
 */

DI.register(Dependencies.AuthService, async () => {
    return new MockAuthService();
});

/**
 * Infrastructures
 */

DI.register(Dependencies.RoomRepository, async () => {
    const config = await DI.resolve(Dependencies.Config);
	const client = await DI.resolve(Dependencies.MongoClient);

    return new RoomRepositoryImpl(
		client,
		config.db.url.split('/').pop()!
	);
});

DI.register(Dependencies.UserRepository, async () => {
    const config = await DI.resolve(Dependencies.Config);
	const client = await DI.resolve(Dependencies.MongoClient);

    return new UserRepositoryImpl(
		client,
		config.db.url.split('/').pop()!
	);
});

DI.register(Dependencies.MongoClient, async () => {
    const config = await DI.resolve(Dependencies.Config);

    const client = new MongoClient(config.db.url);
    await client.connect();

    return client;
});
