const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');
const FriendType = require('./FriendType');
const storyModel = require('../../models/storyModel');
const { StoryType } = require('./StoryType');

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
    voiceIntro: { type: GraphQLString },

    friends: {
      type: new GraphQLList(FriendType),
    },
    blockedByMe: {
      type: new GraphQLList(FriendType),
      resolve: parent => parent.blockedUsers || [],
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
