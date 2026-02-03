const { GraphQLList, GraphQLID } = require('graphql');
const getUserStories = require('../resolver/getUserStories');
const { StoryType } = require('../types/StoryType');

let userStoriesQuery = {
  getUserStories: {
    type: new GraphQLList(StoryType),
    args: {
      userId: { type: GraphQLID },
    },
    resolve: (_, args, context) => {
      return getUserStories(_,args, context);
    },
  },
};

module.exports = userStoriesQuery;
