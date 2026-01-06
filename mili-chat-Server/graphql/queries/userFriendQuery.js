const { GraphQLList, GraphQLID } = require('graphql');
const FriendType = require('../types/FriendType');
const getUserFriends = require('../resolver/getUserFriends');

let userFriendQuery = {
  getUserFriend: {
    type: new GraphQLList(FriendType),
    args: {
      userId: { type: GraphQLID },
    },
    resolve: (parent, args, context) => {
      return getUserFriends(args, context);
    },
  },
};

module.exports = userFriendQuery;
