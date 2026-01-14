const { GraphQLList, GraphQLString, GraphQLID } = require('graphql');

const user = require('../../models/user');
const { UserType } = require('../types/userType');
const { getMe } = require('../resolver/meResolver');

const userQuery = {
  users: {
    type: new GraphQLList(UserType),
    resolve: async (parent, args, context) => {
      if (!context.userId) throw new Error('Unauthorized');
      return await user.find({ _id: { $ne: context.userId } });
    },
  },

  user: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve: async (_, args) => {
      return await user.findById(args.id);
    },
  },

  me: {
    type: UserType,
    resolve: (parent, args, context) => {
      return getMe(context);
    },
  },
};

module.exports = userQuery;
