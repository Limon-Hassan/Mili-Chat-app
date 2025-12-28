const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const userQuery = require('./queries/userQuery');
const userResolver = require('./resolver/userResolver');
const friendsQuery = require('./queries/friendRequestQueries');
const friendRequestResolver = require('./resolver/friendRequestResolver');

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery, 
    ...friendsQuery,
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userResolver, 
    ...friendRequestResolver,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
