const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

const FriendType = new GraphQLObjectType({
  name: 'Friend',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    avatar: { type: GraphQLString },
  }),
});

module.exports = FriendType;
