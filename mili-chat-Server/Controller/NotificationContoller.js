const notification = require('../models/notification');
const { getIO, getSockets } = require('../socket_server');

async function createNotify({ userId, type, message, relatedUserId }) {
  try {
    let notify = new notification({
      user: userId,
      type: type,
      message: message,
      relatedUser: relatedUserId,
    });
    await notify.save();

    const io = getIO();
    getSockets(userId).forEach(sid => {
      io.to(sid).emit('newNotification', notify);
    });
    return notify;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Could not create notification');
  }
}

async function getNotification(userId) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    let notifications = await notification
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('relatedUser', 'id name avatar');
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Could not fetch notifications');
  }
}

async function markAsSeen(userId) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    await notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );
    const io = getIO();
    getSockets(userId).forEach(sid => {
      io.to(sid).emit('notificationSeen');
    });

    return true;
  } catch (error) {
    console.error('Error marking notifications as seen:', error);
    throw new Error('Could not mark notifications as seen');
  }
}

module.exports = { createNotify, getNotification, markAsSeen };
