const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
} = require('graphql');
const { UserType } = require('./userType');
const { StoryUserType } = require('./StoryUserType');

let ReactionType = new GraphQLObjectType({
  name: 'Reaction',
  fields: () => ({
    user: { type: StoryUserType },
    type: { type: GraphQLString },
    reactedAt: { type: GraphQLString },
  }),
});

let SeenType = new GraphQLObjectType({
  name: 'Seen',
  fields: () => ({
    user: { type: StoryUserType },
    seenAt: { type: GraphQLString },
  }),
});

let storyItemType = new GraphQLObjectType({
  name: 'StoryItem',
  fields: () => ({
    id: { type: GraphQLID },
    video: { type: GraphQLString },
    expiresAt: { type: GraphQLString },
    reactions: { type: new GraphQLList(ReactionType) },
    seenBy: { type: new GraphQLList(SeenType) },
    expiredNotified: { type: GraphQLBoolean },
  }),
});

let StoryType = new GraphQLObjectType({
  name: 'Story',
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: StoryUserType },
    stories: { type: new GraphQLList(storyItemType) },
    privacy: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

module.exports = { StoryType };
