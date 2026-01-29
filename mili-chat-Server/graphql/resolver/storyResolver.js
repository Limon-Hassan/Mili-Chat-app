const { GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql');
const { StoryType } = require('../types/StoryType');
const {
  createStory,
  markAsSeen,
  storyReaction,
} = require('../../Controller/StoryController');

let storyResolver = {
  createStory: {
    type: StoryType,
    args: {
      video: { type: GraphQLString },
    },
    resolve: (parent, args, context) => {
      return createStory({ videoUrl: args.video }, context);
    },
  },
  markStorySeen: {
    type: StoryType,
    args: {
      storyId: { type: new GraphQLNonNull(GraphQLID) },
      storyItemId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: (parent, args, context) => {
      return markAsSeen(args, context);
    },
  },
  reactToStory: {
    type: StoryType,
    args: {
      storyId: { type: new GraphQLNonNull(GraphQLID) },
      storyItemId: { type: new GraphQLNonNull(GraphQLID) },
      reaction: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (parent, args, context) => {
      return storyReaction(args, context);
    },
  },
};

module.exports = storyResolver;
