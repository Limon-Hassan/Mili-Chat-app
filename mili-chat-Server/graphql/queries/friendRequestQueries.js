const { GraphQLList } = require('graphql');
const { FriendRequestType } = require('../types/FriendRequestType');
const friendRequest = require('../../models/friendRequest');

let friendsQuery = {
  friendRequests: {
    type: new GraphQLList(FriendRequestType),

    resolver(parent, args, context) {
      if (!context.userId) {
        throw new Error('Unauthorized');
      }
      return friendRequest
        .find({
          to: context.userId,
          status: 'pending',
        })
        .populate('from');
    },
  },
};

module.exports = friendsQuery;
