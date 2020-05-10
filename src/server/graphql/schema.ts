import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Room {
	  id: ID!
	  invitationCode: String!
	  capacity: Int!
	  players: [User]!
  }

  type User {
	  id: ID!
	  name: String!
  }

  type Query {
	  room(id: ID, invitationCode: String): Room
  }

  type Mutation {
	  createRoom(capacity: Int!, name: String!): Room
	  joinRoom(invitationCode: String!): Room
	  exitRoom(roomId: String!): Room
	  createUser: User
  }
`;
