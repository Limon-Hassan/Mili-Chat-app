const { GraphQLID, GraphQLString, GraphQLBoolean } = require('graphql');
const { NotificationType } = require('../types/notificationType');
const { createNotify, markAsSeen } = require('../../Controller/NotificationContoller');

module.exports = {
  createNotification: {
    type: NotificationType,
    args: {
      userId: { type: GraphQLID },
      type: { type: GraphQLString },
      message: { type: GraphQLString },
      relatedUserId: { type: GraphQLID },
    },
    resolve(parent, args) {
      return createNotify(args);
    },
  },

  markNotificationsAsSeen: {
    type: GraphQLBoolean,
    resolve(parent, args, context) {
      if (!context.userId) throw new Error('Unauthorized');
      return markAsSeen(context.userId);
    },
  },
};
