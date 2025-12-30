const { GraphQLList, GraphQLID } = require('graphql');
const { GroupType } = require('../types/GroupType');
const groupSchema = require('../../models/groupSchema');

const groupQuery = {
  myGroups: {
    type: new GraphQLList(GroupType),
    resolve(parent, args, context) {
      if (!context.userId) throw new Error('Unauthorized');
      return groupSchema
        .find({ members: context.userId })
        .populate('members Admin', 'id name email');
    },
  },

  group: {
    type: GroupType,
    args: { groupId: { type: GraphQLID } },
    async resolve(parent, { groupId }, context) {
      if (!context.userId) throw new Error('Unauthorized');
      const group = await groupSchema
        .findById(groupId)
        .populate('members Admin', 'id name email');
      if (!group.members.map(m => m.toString()).includes(context.userId)) {
        throw new Error('You are not a member of this group.');
      }
      return group;
    },
  },
};

module.exports = groupQuery;
