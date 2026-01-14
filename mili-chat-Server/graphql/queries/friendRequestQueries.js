const { GraphQLList } = require('graphql');
const { FriendRequestType } = require('../types/FriendRequestType');
const friendRequest = require('../../models/friendRequest');

let friendsQuery = {
  friendRequests: {
    type: new GraphQLList(FriendRequestType),

    async resolve(parent, args, context) {
      if (!context.userId) {
        throw new Error('Unauthorized');
      }
      return await friendRequest
        .find({
          to: context.userId,
          status: 'pending',
        })
        .populate('from');
    },
  },

  sentFriendRequests: {
    type: new GraphQLList(FriendRequestType),

    async resolve(parent, args, context) {
      if (!context.userId) {
        throw new Error('Unauthorized');
      }

      return await friendRequest
        .find({
          from: context.userId,
          status: 'pending',
        })
        .populate('to');
    },
  },
};

module.exports = friendsQuery;
