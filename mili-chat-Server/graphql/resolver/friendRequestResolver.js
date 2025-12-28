const { GraphQLID } = require('graphql');
const {
  sendFriendRequest,
  acceptFriendRequest,
  requestRejected,
  unfriend,
} = require('../../Controller/FriendRequestController');
const { FriendRequestType } = require('../types/FriendRequestType');
const { UserType } = require('../types/userType');

let friendRequestResolver = {
  sendFriendRequest: {
    type: FriendRequestType,
    args: {
      toUserId: { type: GraphQLID },
    },
    resolve(parent, args, context) {
      return sendFriendRequest(args, context);
    },
  },

  acceptFriendRequest: {
    type: FriendRequestType,
    args: {
      requestId: { type: GraphQLID },
    },
    resolve(parent, args, context) {
      return acceptFriendRequest(args, context);
    },
  },
  requestRejected: {
    type: FriendRequestType,
    args: {
      requestId: { type: GraphQLID },
    },
    resolve(parent, args, context) {
      return requestRejected(args, context);
    },
  },

  unfriend: {
    type: UserType,
    args: {
      friendId: { type: GraphQLID },
    },
    resolve(parent, args, context) {
      return unfriend(args, context);
    },
  },
};

module.exports = friendRequestResolver;
