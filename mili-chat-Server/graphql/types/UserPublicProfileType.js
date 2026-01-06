const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');

const VoiceIntroType = new GraphQLObjectType({
  name: 'VoiceIntro',
  fields: () => ({
    url: { type: GraphQLString },
    duration: { type: GraphQLString },
  }),
});

const UserPublicProfileType = new GraphQLObjectType({
  name: 'UserPublicProfile',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    avatar: { type: GraphQLString },
    bio: { type: GraphQLString },
    voiceIntro: { type: VoiceIntroType },
  }),
});

module.exports = { UserPublicProfileType };
