const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');

let UserPublicProfileType = new GraphQLObjectType({
  name: 'UserPublicProfile',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    avatar: { type: GraphQLString },
    bio: { type: GraphQLString },
    voiceIntro: {
      type: new GraphQLObjectType({
        name: 'VoiceIntro',
        fields: {
          url: { type: GraphQLString },
          duration: { type: GraphQLString },
        },
      }),
    },
  }),
});

module.exports = UserPublicProfileType;
