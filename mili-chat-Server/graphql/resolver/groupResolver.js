const { GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql');
const { GroupType } = require('../types/GroupType');
const {
  createGroup,
  addMembers,
  removeMember,
  leaveGroup,
  deleteGroup,
  handleJoinRequest,
  requestToJoinGroup,
} = require('../../Controller/GroupController');

const groupMutation = {
  createGroup: {
    type: GroupType,
    args: {
      name: { type: GraphQLString },
      members: { type: new GraphQLList(GraphQLID) },
      photo: { type: GraphQLString },
    },
    resolve(parent, args, context) {
      return createGroup(args, context);
    },
  },

  addMembers: {
    type: GroupType,
    args: {
      groupId: { type: GraphQLID },
      members: { type: new GraphQLList(GraphQLID) },
    },
    resolve(parent, args, context) {
      return addMembers(args, context);
    },
  },

  removeMember: {
    type: GroupType,
    args: {
      groupId: { type: GraphQLID },
      memberId: { type: GraphQLID },
    },
    resolve(parent, args, context) {
      return removeMember(args, context);
    },
  },

  leaveGroup: {
    type: GroupType,
    args: {
      groupId: { type: GraphQLID },
    },
    resolve(parent, args, context) {
      return leaveGroup(args, context);
    },
  },

  deleteGroup: {
    type: GraphQLString,
    args: {
      groupId: { type: GraphQLID },
    },
    async resolve(parent, args, context) {
      const result = await deleteGroup(args, context);
      return result ? 'Group deleted successfully' : 'Failed to delete';
    },
  },
  requestToJoinGroup: {
    type: GroupType,
    args: {
      groupId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args, context) {
      return requestToJoinGroup(args, context);
    },
  },

  handleJoinRequest: {
    type: GroupType,
    args: {
      groupId: { type: new GraphQLNonNull(GraphQLID) },
      userId: { type: new GraphQLNonNull(GraphQLID) },
      action: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve(parent, args, context) {
      return handleJoinRequest(args, context);
    },
  },
};

module.exports = groupMutation;
