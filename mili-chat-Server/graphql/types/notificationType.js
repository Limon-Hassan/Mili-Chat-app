const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');
const { UserType } = require('./userType');

let NotificationType = new GraphQLObjectType({
  name: 'Notification',
  fields: () => ({
    id: { type: GraphQLID },
    type: { type: GraphQLString },
    message: { type: GraphQLString },
    isRead: { type: GraphQLBoolean },
    relatedUser: { type: UserType },
    createdAt: { type: GraphQLString },
  }),
});

module.exports = { NotificationType };
