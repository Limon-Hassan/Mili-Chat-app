const { GraphQLList, GraphQLString, GraphQLID } = require('graphql');

const user = require('../../models/user');
const { UserType } = require('../types/userType');

const userQuery = {
  users: {
    type: new GraphQLList(UserType),
    resolve: async () => {
      return await user.find();
    },
  },

  user: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve: async (_, args) => {
      return await user.findById(args.id);
    },
  },
};

module.exports = userQuery;
