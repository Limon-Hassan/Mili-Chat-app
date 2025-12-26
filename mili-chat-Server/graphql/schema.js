const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const userQuery = require('./queries/userQuery');
const userResolver = require('./resolver/userResolver');

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery, 
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userResolver, 
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
