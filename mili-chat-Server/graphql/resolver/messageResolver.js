const { GraphQLID, GraphQLString, GraphQLBoolean } = require('graphql');
const { MessageType } = require('../types/MessageType');
const {
  markMassageAsDelivery,
  markMessagesAsRead,
  deleteMessage,
  deleteConversation,
  editMessage,
  reactToMessage,
  sendMessageWithId,
  sendFirstMessage,
} = require('../../Controller/ConversationController');

const messageResolver = {
  sendMessage: {
    type: MessageType,
    args: {
      conversationId: { type: GraphQLID },
      text: { type: GraphQLString },
      receiverId: { type: GraphQLID },
      mediaUrl: { type: GraphQLString },
      type: { type: GraphQLString },
      duration: { type: GraphQLString },
    },
    resolve: (parent, args, context) => sendFirstMessage(args, context),
  },

  sendMessageStrict: {
    type: MessageType,
    args: {
      conversationId: { type: GraphQLID }, 
      text: { type: GraphQLString },
      receiverId: { type: GraphQLID },
      mediaUrl: { type: GraphQLString },
      type: { type: GraphQLString },
      duration: { type: GraphQLString },
    },
    resolve: (parent, args, context) => {
      if (!args.conversationId) {
        throw new Error('conversationId is required for sendMessageStrict');
      }
      return sendMessageWithId(args, context);
    },
  },

  markAsDelivered: {
    type: GraphQLBoolean,
    args: {
      conversationId: { type: GraphQLID },
    },
    resolve: (parent, args, context) => markMassageAsDelivery(args, context),
  },

  markAsRead: {
    type: GraphQLBoolean,
    args: {
      conversationId: { type: GraphQLID },
    },
    resolve: (parent, args, context) => markMessagesAsRead(args, context),
  },

  deleteMessage: {
    type: GraphQLBoolean,
    args: {
      messageId: { type: GraphQLID },
    },
    resolve: (parent, args, context) => deleteMessage(args, context),
  },

  deleteConversation: {
    type: GraphQLBoolean,
    args: {
      conversationId: { type: GraphQLID },
    },
    resolve: (parent, args, context) => deleteConversation(args, context),
  },

  editMessage: {
    type: MessageType,
    args: {
      messageId: { type: GraphQLID },
      newText: { type: GraphQLString },
    },
    resolve: (parent, args, context) => editMessage(args, context),
  },

  reactToMessage: {
    type: MessageType,
    args: {
      messageId: { type: GraphQLID },
      emoji: { type: GraphQLString },
    },
    resolve: (parent, args, context) => reactToMessage(args, context),
  },
};

module.exports = messageResolver;
