const { GraphQLString, GraphQLBoolean } = require('graphql');

const { UserType } = require('../types/userType');
const {
  uploadProfilePic,
  updateProfile,
  AddOwnVoice,
  updatePrivacy,
} = require('../../Controller/UserController');

const userResolver = {
  uploadProfilePic: {
    type: UserType,
    args: {
      profilePic: { type: GraphQLString },
    },
    resolve(parent, args, context) {
      return uploadProfilePic(args, context);
    },
  },

  updateProfile: {
    type: UserType,
    args: {
      name: { type: GraphQLString },
      bio: { type: GraphQLString },
    },
    resolve(parent, args, context) {
      return updateProfile(args, context);
    },
  },

  addOwnVoice: {
    type: UserType,
    args: {
      voice: { type: GraphQLString },
    },
    resolve(parent, args, context) {
      return AddOwnVoice(args, context);
    },
  },
   
  updatedPrivacy: {
    type: UserType,
    args: {
      storyPrivacy: { type: GraphQLString },
      friendPrivacy: { type: GraphQLString },
      ownVoicePrivacy: { type: GraphQLString },
      profilePicLock: { type: GraphQLBoolean },
    },
    resolve(parent, args, context) {
      return updatePrivacy(args, context);
    },
  }

};

module.exports = userResolver;
