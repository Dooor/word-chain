import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';
import { constructTestServer, mockSessionData } from '../_utils';

import { v4 as uuidv4 } from 'uuid';

const CREATE_ROOM = gql`
	mutation CreateRoom($name: String!, $capacity: Int!) {
		createRoom(name: $name, capacity: $capacity) {
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

const JOIN_ROOM = gql`
	mutation JoinRoom($invitationCode: String!) {
		joinRoom(invitationCode: $invitationCode) {
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

const EXIT_ROOM = gql`
	mutation ExitRoom($roomId: String!) {
		exitRoom(roomId: $roomId) {
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

describe('Mutations', () => {
	describe('create room', () => {
		it('正常系', async () => {
			const roomId = uuidv4();
			const mockData = { id: roomId, invitationCode: '123456', capacity: 2, players: [{ id: 'xxxx', name: 'Tester' }] };

			const { server, roomAPI } = constructTestServer({
				context: async () => ({ session: mockSessionData() })
			});

			roomAPI.createRoom = jest.fn(async () => mockData);

			const { mutate } = createTestClient(server);
			const { data, errors } = await mutate({ mutation: CREATE_ROOM, variables: { name: 'Test_Room', capacity: 2 } });

			expect(errors).toBeUndefined;
			expect(data).toEqual({ createRoom: mockData });
		});
	});

	describe('join room', () => {
		it('正常系', async () => {
			const roomId = uuidv4();
			const mockData = { id: roomId, invitationCode: '123456', capacity: 2, players: [{ id: 'xxxx', name: 'Tester' }] };

			const { server, roomAPI } = constructTestServer({
				context: async () => ({ session: mockSessionData() })
			});

			roomAPI.joinRoom = jest.fn(async () => mockData);

			const { mutate } = createTestClient(server);
			const { data, errors } = await mutate({ mutation: JOIN_ROOM, variables: { invitationCode: '123456' } });

			expect(errors).toBeUndefined;
			expect(data).toEqual({ joinRoom: mockData });
		});
	});

	describe('exit room', () => {
		it('正常系', async () => {
			const roomId = uuidv4();
			const mockData = { id: roomId, invitationCode: '123456', capacity: 2, players: [] };

			const { server, roomAPI } = constructTestServer({
				context: async () => ({ session: mockSessionData() })
			});

			roomAPI.exitRoom = jest.fn(async () => mockData);

			const { mutate } = createTestClient(server);
			const { data, errors } = await mutate({ mutation: EXIT_ROOM, variables: { roomId } });

			expect(errors).toBeUndefined;
			expect(data).toEqual({ exitRoom: mockData });
		});
	});
});
