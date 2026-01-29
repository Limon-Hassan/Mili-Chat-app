const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");
const { UserType } = require("./userType");

const FriendRequestType = new GraphQLObjectType({
  name: 'FriendRequest',
  fields: () => ({
    id: { type: GraphQLID },
    from: { type: UserType },
    to: { type: UserType },
    avatar: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

module.exports = { FriendRequestType };