const { GraphQLObjectType, GraphQLString } = require('graphql');

let voiceIntro = new GraphQLObjectType({
  name: 'voiceInto',
  fields: () => ({
    url: { type: GraphQLString },
  }),
});

module.exports = { voiceIntro };
