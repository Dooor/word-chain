// Domains
import { GameEntity } from '@server/domains/game/Game';

// Types
import {
	Game as GameResponse,
} from '@server/graphql/types';

export namespace GamePresenter {
	export function toResponse(game: GameEntity): GameResponse {
		return {
			id: game.id.value,
			players: game.players.map((player) => ({
				turn: player.turn.value,
				user: {
					id: player.user.id.value,
					name: player.user.name.value,
				},
			})),
		};
	}
}
