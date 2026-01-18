const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLUnionType,
} = require('graphql');
const { UserType } = require('./userType');
const FriendType = require('./FriendType');

let GroupFullType = new GraphQLObjectType({
  name: 'GroupFull',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    photo: { type: GraphQLString },
    Admin: { type: UserType },
    members: { type: new GraphQLList(UserType) },
    createdAt: { type: GraphQLString },
  }),
});

const GroupPreviewType = new GraphQLObjectType({
  name: 'GroupPreview',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    photo: { type: GraphQLString },

    friendCount: { type: GraphQLInt },
    friends: { type: new GraphQLList(FriendType) },
  }),
});

const GroupResultType = new GraphQLUnionType({
  name: 'GroupResult',
  types: [GroupFullType, GroupPreviewType],
  resolveType(value) {
    if (value.members) {
      return GroupFullType;
    }
    return GroupPreviewType;
  },
});

module.exports = { GroupFullType, GroupPreviewType, GroupResultType };
