const { GraphQLString } = require('graphql');
const { UserType, AuthType } = require('../types/userType');
const {
  registation,
  login,
  googleLogin,
  refreshToken,
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
    resolve(parent, args) {
      return login(args);
    },
  },

  googleLogin: {
    type: AuthType,
    args: {
      token: { type: GraphQLString },
    },
    resolve(parent, args) {
      return googleLogin(args);
    },
  },
  facebookLogin: {
    type: AuthType,
    args: {
      accessToken: { type: GraphQLString },
    },
    resolve(parent, args) {
      return facebookLogin(args);
    },
  },

  refreshToken: {
    type: AuthType,
    args: {
      refreshToken: { type: GraphQLString },
    },
    resolve(parent, args) {
      return refreshToken(args);
    },
  },

  logout: {
    type: LogoutType,
    resolve(parent, args, context) {
      return logout(context);
    },
  },
};
