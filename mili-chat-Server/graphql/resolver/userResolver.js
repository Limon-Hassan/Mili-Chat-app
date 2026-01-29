const { GraphQLString, GraphQLBoolean, GraphQLFloat } = require('graphql');

const { UserType } = require('../types/userType');
const {
  uploadProfilePic,
  updateProfile,
  AddOwnVoice,
  StoryPrivacy,
  FriendPrivacy,
  OwnVoicePrivacy,
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
      duration: { type: GraphQLFloat },
    },
    resolve(parent, args, context) {
      return AddOwnVoice(args, context);
    },
  },

  storyPrivacy: {
    type: GraphQLBoolean,
    args: {
      statusVisibility: { type: GraphQLBoolean },
    },
    resolve(parent, args, context) {
      return StoryPrivacy(args, context);
    },
  },

  friendPrivacy: {
    type: GraphQLBoolean,
    args: {
      friendListVisibility: { type: GraphQLBoolean },
    },
    resolve(parent, args, context) {
      return FriendPrivacy(args, context);
    },
  },

  OwnVoicePrivacy: {
    type: GraphQLBoolean,
    args: {
      OwnVoicePrivacy: { type: GraphQLBoolean },
    },
    resolve(parent, args, context) {
      return OwnVoicePrivacy(args, context);
    },
  },
};

module.exports = userResolver;
