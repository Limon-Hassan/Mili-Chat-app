const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require('graphql');
const { UserType } = require('./userType');

let GroupType = new GraphQLObjectType({
  name: 'Group',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    photo: { type: GraphQLString },
    Admin: { type: UserType },
    members: { type: new GraphQLList(UserType) },
    createdAt: { type: GraphQLString },
  }),
});

module.exports = { GroupType };
