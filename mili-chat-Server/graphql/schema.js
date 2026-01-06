const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const userQuery = require('./queries/userQuery');
const userResolver = require('./resolver/userResolver');
const friendsQuery = require('./queries/friendRequestQueries');
const friendRequestResolver = require('./resolver/friendRequestResolver');
const notificationQuery = require('./queries/notificationQuery');
const NotificationResolver = require('./resolver/NotificationResolver');
const groupQuery = require('./queries/groupQueries');
const groupMutation = require('./resolver/groupResolver');
const storyResolver = require('./resolver/storyResolver');
const storyQuery = require('./queries/storyQuery');
const messageQueries = require('./queries/messageQueries');
const messageResolver = require('./resolver/messageResolver');
const userProfileQuery = require('./queries/userProfileQuery');
const userFriendQuery = require('./queries/userFriendQuery');
const userStoriesQuery = require('./queries/userStoriesQuery');

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery,
    ...friendsQuery,
    ...notificationQuery,
    ...groupQuery,
    ...storyQuery,
    ...messageQueries,
    ...userFriendQuery,
    ...userStoriesQuery,
    ...userProfileQuery,
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userResolver,
    ...friendRequestResolver,
    ...NotificationResolver,
    ...groupMutation,
    ...storyResolver,
    ...messageResolver,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
