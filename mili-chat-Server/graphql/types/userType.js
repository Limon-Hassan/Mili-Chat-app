const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');
const FriendType = require('./FriendType');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },

    friends: {
      type: new GraphQLList(FriendType),
    },
    blockedUsers: {
      type: new GraphQLList(FriendType),
    },
  }),
});

const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    token: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
    user: { type: UserType },
  }),
});

module.exports = { UserType, AuthType };
