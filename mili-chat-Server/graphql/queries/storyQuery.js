const { GraphQLList } = require('graphql');
const { StoryType } = require('../types/StoryType');
const { getStories } = require('../../Controller/StoryController');

const storyQuery = {
  getStories: {
    type: new GraphQLList(StoryType),
    resolve(parent, args, context) {
      return getStories(context);
    },
  },
};

module.exports = storyQuery;
