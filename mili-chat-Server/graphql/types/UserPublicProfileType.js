const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');
const { voiceIntro } = require('./VoiceIntroType');
const UserPublicProfileType = new GraphQLObjectType({
  name: 'UserPublicProfile',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    avatar: { type: GraphQLString },
    bio: { type: GraphQLString },
    voiceIntro: { type: voiceIntro },
  }),
});

module.exports = { UserPublicProfileType };
