
import { Player, PlayerEntity } from '@server/domains/game/Player';

export interface MongoPlayer {
	readonly turn: number;
	readonly user: {
		readonly id: string;
		readonly name: string;
	};
}

export namespace MongoPlayer {
    export function toPlayer(mongoPlayer: MongoPlayer): Player {
        return Player.create({
			turn: mongoPlayer.turn,
			user: mongoPlayer.user,
		});
    }

    export function fromPlayer(player: PlayerEntity): MongoPlayer {
        return {
			turn: player.turn.value,
			user: {
				id: player.user.id.value,
				name: player.user.name.value,
			},
        };
    }
}
