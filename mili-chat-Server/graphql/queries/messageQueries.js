const { GraphQLList, GraphQLID } = require('graphql');
const conversionSchema = require('../../models/conversionSchema');
const { ConversationType } = require('../types/ConversationType');
const { MessageType } = require('../types/MessageType');
const {
  getMessages,
  getConversation,
} = require('../../Controller/ConversationController');

let messageQueries = {
  getConversation: {
    type: new GraphQLList(ConversationType),
    resolve: (parent, args, context) => {
      return getConversation(context);
    },
  },

  getMessages: {
    type: new GraphQLList(MessageType),
    args: {
      conversationId: { type: GraphQLID },
    },
    resolve: (parent, args, context) => {
      return getMessages(args, context);
    },
  },
};

module.exports = messageQueries;
