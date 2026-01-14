const { GraphQLID, GraphQLBoolean } = require('graphql');
const {
  sendFriendRequest,
  acceptFriendRequest,
  requestRejected,
  unfriend,
  BlockUser,
  unblock,
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
    type: GraphQLBoolean,
    args: {
      requestId: { type: GraphQLID },
    },
    resolve(perent, args, context) {
      return acceptFriendRequest(args, context);
    },
  },

  requestRejected: {
    type: GraphQLBoolean,
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

  blockUser: {
    type: UserType,
    args: {
      blockUserId: { type: GraphQLID },
    },
    resolve(parent, args, context) {
      return BlockUser(args, context);
    },
  },

  unBlock: {
    type: UserType,
    args: {
      unblockUserId: { type: GraphQLID },
    },
    resolve(parent, args, context) {
      return unblock(args, context);
    },
  },
};

module.exports = friendRequestResolver;
