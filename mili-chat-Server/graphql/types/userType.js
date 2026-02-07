const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
} = require('graphql');
const FriendType = require('./FriendType');
const storyModel = require('../../models/storyModel');
const { StoryType } = require('./StoryType');
const { voiceIntro } = require('./VoiceIntroType');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: parent => (parent._id ? parent._id.toString() : parent.id),
    },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
    bio: { type: GraphQLString },
    storyPrivacy: { type: GraphQLString },
    friendListPrivacy: { type: GraphQLString },
    OwnVoicePrivacy: { type: GraphQLString },
    ProfilePicLock: {
      type: GraphQLBoolean,
    },
    voiceIntro: {
      type: voiceIntro,
    },
    friends: {
      type: new GraphQLList(FriendType),
    },
    blockedByMe: {
      type: new GraphQLList(FriendType),
      resolve: parent => parent.blockedUsers || [],
    },

    MsgBlockedUsers: {
      type: new GraphQLList(FriendType),
      resolve: parent => parent.messageBlockedUsers || [],
    },

    stories: {
      type: new GraphQLList(StoryType),
      resolve: async parent => {
        return await storyModel.find({ user: parent._id });
      },
    },
  }),
});

const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    token: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
    user: { type: UserType },
  }),
});

module.exports = { UserType, AuthType };
