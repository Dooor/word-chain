export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Room = {
  readonly __typename?: 'Room';
  readonly id: Scalars['ID'];
  readonly invitationCode: Scalars['String'];
  readonly capacity: Scalars['Int'];
  readonly players: ReadonlyArray<Maybe<User>>;
};

export type Player = {
  readonly __typename?: 'Player';
  readonly user: User;
  readonly turn: Scalars['Int'];
};

export type Game = {
  readonly __typename?: 'Game';
  readonly id: Scalars['ID'];
  readonly players: ReadonlyArray<Maybe<Player>>;
};

export type User = {
  readonly __typename?: 'User';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly room?: Maybe<Room>;
};


export type QueryRoomArgs = {
  id?: Maybe<Scalars['ID']>;
  invitationCode?: Maybe<Scalars['String']>;
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly createRoom?: Maybe<Room>;
  readonly joinRoom?: Maybe<Room>;
  readonly exitRoom?: Maybe<Room>;
  readonly createGame?: Maybe<Game>;
  readonly createUser?: Maybe<User>;
};


export type MutationCreateRoomArgs = {
  capacity: Scalars['Int'];
  name: Scalars['String'];
};


export type MutationJoinRoomArgs = {
  invitationCode: Scalars['String'];
};


export type MutationExitRoomArgs = {
  roomId: Scalars['String'];
};


export type MutationCreateGameArgs = {
  roomId: Scalars['String'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


