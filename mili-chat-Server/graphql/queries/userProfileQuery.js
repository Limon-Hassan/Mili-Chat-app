const { GraphQLID } = require('graphql');
const { UserPublicProfileType } = require('../types/UserPublicProfileType');
const getUserProfile = require('../resolver/getUserProfile');

let userProfileQuery = {
  getUserProfile: {
    type: UserPublicProfileType,
    args: {
      userId: { type: GraphQLID },
    },
    resolve: (_, args, context) => {
      return getUserProfile(_, args, context);
    },
  },
};

module.exports = userProfileQuery;
