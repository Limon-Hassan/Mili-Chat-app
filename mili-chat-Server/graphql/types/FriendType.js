const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

const FriendType = new GraphQLObjectType({
  name: 'Friend',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: parent => parent._id.toString(),
    },
    name: { type: GraphQLString },
    avatar: { type: GraphQLString },
  }),
});

module.exports = FriendType;
