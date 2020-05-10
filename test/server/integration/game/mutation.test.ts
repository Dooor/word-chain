import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';
import { constructTestServer, mockSessionData } from '../_utils';

import { v4 as uuidv4 } from 'uuid';

const CREATE_GAME = gql`
	mutation CreateGame($roomId: String!) {
		createGame(roomId: $roomId) {
			id
			players {
				turn
				user {
					id
					name
				}
			}
		}
	}
`;

describe('Mutations', () => {
	describe('create game', () => {
		it('正常系', async () => {
			const roomId = uuidv4();
			const mockData = { id: roomId, players: [{ turn: 1, user: { id: 'xxxx', name: 'Tester' } }] };

			const { server, gameAPI } = constructTestServer({
				context: async () => ({ session: mockSessionData() })
			});

			gameAPI.createGame = jest.fn(async () => mockData);

			const { mutate } = createTestClient(server);
			const { data, errors } = await mutate({ mutation: CREATE_GAME, variables: { roomId } });

			expect(errors).toBeUndefined;
			expect(data).toEqual({ createGame: mockData });
		});
	});
});

