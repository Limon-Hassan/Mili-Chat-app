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

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery,
    ...friendsQuery,
    ...notificationQuery,
    ...groupQuery,
    ...storyQuery,
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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
