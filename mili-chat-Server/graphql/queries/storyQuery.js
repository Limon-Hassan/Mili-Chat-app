const { GraphQLList } = require('graphql');
const { StoryType } = require('../types/StoryType');
const {
  getAllStories,
  getNewStories,
} = require('../../Controller/StoryController');

const storyQuery = {
  getNewStories: {
    type: new GraphQLList(StoryType),
    resolve(parent, args, context) {
      return getNewStories(context);
    },
  },

  getAllStories: {
    type: new GraphQLList(StoryType),
    resolve(parent, args, context) {
      return getAllStories(context);
    },
  },
};

module.exports = storyQuery;
