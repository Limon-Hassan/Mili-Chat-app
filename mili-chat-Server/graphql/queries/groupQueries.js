const { GraphQLList, GraphQLID } = require('graphql');
const { GroupFullType, GroupPreviewType } = require('../types/GroupType');
const groupSchema = require('../../models/groupSchema');
const user = require('../../models/user');

const groupQuery = {
  myGroups: {
    type: new GraphQLList(GroupFullType),
    async resolve(parent, args, context) {
      if (!context.userId) throw new Error('Unauthorized');
      let groups = await groupSchema
        .find({ members: context.userId })
        .populate('members Admin', 'id name avatar');
      return groups;
    },
  },

  Allgroup: {
    type: new GraphQLList(GroupPreviewType),
    async resolve(parent, args, context) {
      try {
        if (!context.userId) throw new Error('Unauthorized');
        let me = await user
          .findById(context.userId)
          .populate('friends', '_id name avatar');
        let groups = await groupSchema
          .find({ members: { $ne: me._id } })
          .populate('members', '_id name avatar');

        return groups.map(group => {
          const friendsInGroup = me.friends.filter(friend =>
            group.members.some(m => m._id.toString() === friend._id.toString()),
          );

          return {
            id: group._id,
            name: group.name,
            photo: group.photo,
            friendCount: friendsInGroup.length,
            friends: friendsInGroup,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = groupQuery;
