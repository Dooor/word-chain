import 'module-alias/register';

import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';
import { constructTestServer, mockNoUserSessionData } from '../_utils';

import { v4 as uuidv4 } from 'uuid';

const CREATE_USER = gql`
	mutation CreateUser {
		createUser {
			id
			name
		}
	}
`;

describe('Mutations', () => {
	describe('create user', () => {
		it('正常系', async () => {
			const roomId = uuidv4();
			const mockData = { id: roomId, name: 'Tester' };

			const { server, userAPI } = constructTestServer({
				context: async () => ({ session: mockNoUserSessionData() })
			});

			userAPI.createUser = jest.fn(async () => mockData);

			const { mutate } = createTestClient(server);
			const { data, errors } = await mutate({ mutation: CREATE_USER });

			expect(errors).toBeUndefined;
			expect(data).toEqual({ createUser: mockData });
		});
	});
});
