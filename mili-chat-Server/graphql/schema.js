const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return {
          id: args.id,
          name: 'Test User',
          email: 'test@mail.com',
        };
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
