import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';
import { constructTestServer, mockSessionData } from '../_utils';

import { v4 as uuidv4 } from 'uuid';

const GET_ROOM = gql`
	query Room($id: ID!) {
		room(id: $id) {
			id
			invitationCode
			capacity
			players {
				id
				name
			}
		}
	}
`;

describe('Queries', () => {
	describe('fetches room', () => {
		it('正常系', async () => {
			const roomId = uuidv4();
			const mockData = { id: roomId, invitationCode: '123456', capacity: 2, players: [] };

			const { server, roomAPI } = constructTestServer({
				context: async () => ({ session: mockSessionData() })
			});

			roomAPI.getRoom = jest.fn(async () => mockData);

			const { query } = createTestClient(server);
			const { data, errors } = await query({ query: GET_ROOM, variables: { id: roomId } });

			expect(data).toEqual({ room: mockData });
			expect(errors).toBeUndefined;
		});
	});
});
