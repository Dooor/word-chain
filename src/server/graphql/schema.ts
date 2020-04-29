import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Room {
	  id: ID!
	  status: String!
	  invitationCode: String!
	  playerCount: Int!
  }

  type User {
	  id: ID!
	  name: String!
  }

  type Query {
	  room(id: ID, invitationCode: String): Room
  }

  type Mutation {
	  createRoom: Room
  }
`;
