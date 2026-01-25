const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
} = require('graphql');
const { UserType } = require('./userType');

const ConversationType = new GraphQLObjectType({
  name: 'Conversation',
  fields: () => ({
    id: { type: GraphQLID },
    participants: { type: new GraphQLList(UserType) },
    isGroup: { type: GraphQLBoolean },
    type: { type: GraphQLString },
    group: { type: GraphQLString },
    otherUser: { type: UserType },
    lastMessage: { type: GraphQLString },
    lastMessageType: { type: GraphQLString },
    lastMessageAt: { type: GraphQLString },
  }),
});

module.exports = { ConversationType };
