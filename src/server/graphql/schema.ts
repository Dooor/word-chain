import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Your schema will go here

  type Room {
	  id: ID!
	  status: String!
	  invitationCode: String!
	  secretCode: String
	  playerCount: Int!
  }

  type User {
	  id: ID!
	  name: String!
  }

  type Game {
	  id: ID!
	  room: Room
	  players: [User]!
  }

  type Query {
	  game(id: ID!): Game
  }
`;
