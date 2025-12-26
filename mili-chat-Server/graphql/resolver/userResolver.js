const { GraphQLString } = require('graphql');
const { UserType, AuthType } = require('../types/userType');
const { registation, login } = require('../../Controller/AuthController');

module.exports = {
  register: {
    type: UserType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    resolve(parent, args) {
      return registation(args);
    },
  },

  loginUser: {
    type: AuthType,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    resolve(parent, args) {
      return login(args);
    },
  },

  //   deleteUser: {
  //     type: UserType,
  //     args: {
  //       id: { type: GraphQLString },
  //     },
  //     resolve(parent, args) {
  //       return deleteUser(args.id);
  //     },
  //   },
};
