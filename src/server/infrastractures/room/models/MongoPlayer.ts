
import { User as Player, UserEntity as PlayerEntity } from '@server/domains/user/User';

export interface MongoPlayer {
    readonly id: string;
	readonly name: string;
}

export namespace MongoPlayer {
    export function toPlayer(mongoPlayer: MongoPlayer): Player {
        return Player.create({
			name: mongoPlayer.name,
		}, mongoPlayer.id);
    }

    export function fromPlayer(player: PlayerEntity): MongoPlayer {
        return {
			id: player.id.value,
			name: player.name.value,
        };
    }
}
