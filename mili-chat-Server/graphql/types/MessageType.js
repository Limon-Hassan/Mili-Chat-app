const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
} = require('graphql');
const { UserType } = require('./userType');
const { ConversationType } = require('./ConversationType');

let MsgReactionType = new GraphQLObjectType({
  name: 'MsgReaction',
  fields: () => ({
    user: { type: UserType },
    emoji: { type: GraphQLString },
  }),
});

let MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: { type: GraphQLID },
    conversation: {
      type: ConversationType,
      resolve: async parent => {
        const conv = await require('../../models/conversionSchema').findById(
          parent.conversation
        );
        return conv;
      },
    },
    sender: { type: UserType },
    receiver: { type: UserType },
    text: { type: GraphQLString },
    mediaUrl: { type: GraphQLString },
    type: { type: GraphQLString },
    duration: { type: GraphQLString },
    isRead: { type: GraphQLBoolean },
    readAt: { type: GraphQLString },
    deliveryStatus: { type: GraphQLString },
    deliveredAt: { type: GraphQLString },
    reactions: { type: new GraphQLList(MsgReactionType) },
    deletedFor: { type: new GraphQLList(UserType) },
    createdAt: { type: GraphQLString },
    editedAt: { type: GraphQLString },
  }),
});

module.exports = { MessageType };
