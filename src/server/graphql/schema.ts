import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Room {
	  id: ID!
	  invitationCode: String!
	  capacity: Int!
	  players: [User]!
  }

  type Player {
	  user: User!
	  turn: Int!
  }

  type Game {
	  id: ID!
	  players: [Player]!
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
	  createGame(roomId: String!): Game
	  createUser: User
  }
`;
