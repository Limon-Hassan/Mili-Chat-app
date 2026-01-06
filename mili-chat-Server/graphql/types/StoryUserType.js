const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');

let StoryUserType = new GraphQLObjectType({
  name: 'StoryUser',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    avatar: { type: GraphQLString },
  }),
});

module.exports = { StoryUserType };
