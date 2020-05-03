import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';
import { constructTestServer, mockSessionData } from '../_utils';

import { v4 as uuidv4 } from 'uuid';

const CREATE_ROOM = gql`
	mutation CreateRoom {
		createRoom {
			id
			invitationCode
			playerCount
			players {
				id
				name
			}
		}
	}
`;

describe('Mutations', () => {
	describe('create room', () => {
		it('正常系', async () => {
			const roomId = uuidv4();
			const mockData = { id: roomId, invitationCode: '123456', playerCount: 2, players: [{ id: 'xxxx', name: 'Tester' }] };

			const { server, roomAPI } = constructTestServer({
				context: async () => ({ session: mockSessionData() })
			});

			roomAPI.createRoom = jest.fn(async () => mockData);

			const { mutate } = createTestClient(server);
			const { data, errors } = await mutate({ mutation: CREATE_ROOM });

			expect(errors).toBeUndefined;
			expect(data).toEqual({ createRoom: mockData });
		});
	});
});
