const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql');
const User = require('../../models/user');
const UserType = require('../types/userType');

const userQuery = {
  users: {
    type: new GraphQLList(UserType),
    resolve() {
      return User.find();
    },
  },

  user: {
    type: UserType,
    args: { id: { type: GraphQLString } },
    resolve(parent, args) {
      return User.findById(args.id);
    },
  },
};

module.exports = userQuery;
