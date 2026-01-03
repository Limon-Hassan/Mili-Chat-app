const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require('graphql');
const { UserType } = require('./userType');

const ConversationType = new GraphQLObjectType({
  name: 'Conversation',
  fields: () => ({
    id: { type: GraphQLID },
    participants: { type: new GraphQLList(UserType) },
    lastMessage: { type: GraphQLString },
    lastMessageType: { type: GraphQLString },
    lastMessageAt: { type: GraphQLString },
  }),
});

module.exports = { ConversationType };
