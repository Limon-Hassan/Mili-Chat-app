const { GraphQLString } = require('graphql');
const { UserType, AuthType } = require('../types/userType');
const {
  registation,
  login,
  googleLogin,
  facebookLogin,
  logout,
} = require('../../Controller/AuthController');
const LogoutType = require('../types/LogoutType');

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
    resolve(parent, args, context) {
      return login(args, context);
    },
  },

  googleLogin: {
    type: AuthType,
    args: {
      accessToken: { type: GraphQLString },
    },
    resolve(parent, args, context) {
      return googleLogin(args, context);
    },
  },
  facebookLogin: {
    type: AuthType,
    args: {
      accessToken: { type: GraphQLString },
    },
    resolve(parent, args, context) {
      return facebookLogin(args, context);
    },
  },


  logout: {
    type: LogoutType,
    resolve(parent, args, context) {
      return logout(context);
    },
  },
};
