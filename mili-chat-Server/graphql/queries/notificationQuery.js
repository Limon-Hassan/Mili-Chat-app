const { GraphQLList } = require('graphql');
const { NotificationType } = require('../types/notificationType');
const { getNotification } = require('../../Controller/NotificationContoller');

const notificationQuery = {
  notifications: {
    type: new GraphQLList(NotificationType),
    resolve(parent, args, context) {
      if (!context.userId) throw new Error('Unauthorized');
      return getNotification(context.userId);
    },
  },
};

module.exports = notificationQuery;
