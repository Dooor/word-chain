
import mongodb, { MongoClient } from 'mongodb';
import { DI } from './DIUtils';

import { RoomRepository } from '@server/domains/game/RoomRepository';
import { RoomRepositoryImpl } from '@server/infrastractures/game/RoomRepositoryImpl';

const Config = {
    db: {
        url: 'mongodb://root:root@localhost:27017/word-chain-db'
    }
};

export const Dependencies = {
	Config: DI.Dependency<typeof Config>(),
	RoomRepository: DI.Dependency<RoomRepository>(),
    MongoClient: DI.Dependency<mongodb.MongoClient>()
};

DI.register(Dependencies.Config, async () => Config);

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

DI.register(Dependencies.MongoClient, async () => {
    const config = await DI.resolve(Dependencies.Config);

    const client = new MongoClient(config.db.url);
    await client.connect();

    return client;
});
