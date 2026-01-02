const conversionSchema = require('../models/conversionSchema');
const messageModel = require('../models/messageModel');

async function SendMessage(
  { conversationId, text, receiverId, mediaUrl, type, duration },
  context
) {
  if (!context.userId) throw new Error('Authentication required');

  let allowedtypes = ['text', 'image', 'video', 'audio', 'link'];
  if (!allowedtypes.includes(type)) {
    throw new Error('Invalid message type');
  }

  let conversation = await conversionSchema.findById(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  let isParticipant = conversation.participants.some(
    pt => pt.toString() === context.userId
  );

  if (!isParticipant) {
    throw new Error('You are not a participant in this conversation');
  }

  let message = new messageModel.create({
    conversation: conversationId,
    sender: context.userId,
    receiver: receiverId,
    type: type,
    text: type === 'text' || type === 'link' ? text : undefined,
    mediaUrl: mediaUrl || undefined,
    duration: duration || undefined,
    deliveryStatus: 'sent',
  });

  conversation.lastMessage =
    type === 'text' || type === 'link' ? text : `[${type}]`;
  conversation.lastMessageType = type;
  conversation.lastMessageAt = new Date();

  await conversation.save();
  await message.populate('sender', 'id name email');
  await message.populate('receiver', 'id name email');
  return message;
}

async function getMessages({ conversationId }, context) {
  if (!context.userId) throw new Error('Authentication required');

  const conversation = await conversionSchema.findById(conversationId);
  if (!conversation) throw new Error('Conversation not found');

  const isParticipant = conversation.participants.some(
    id => id.toString() === context.userId
  );
  if (!isParticipant) throw new Error('Access denied');

  const messages = await messageModel
    .find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

  return messages;
}

async function getConversation(context) {
  if (!context.userId) throw new Error('Authentication required');

  const conversations = await conversionSchema
    .find({
      participants: context.userId,
    })
    .populate('participants', 'name avatar')
    .sort({ lastMessageAt: -1 })
    .lean();

  const formatted = conversations.map(conv => {
    const otherUser = conv.participants.find(
      p => p._id.toString() !== context.userId
    );

    return {
      id: conv._id,
      otherUser,
      lastMessage: conv.lastMessage,
      lastMessageType: conv.lastMessageType,
      lastMessageAt: conv.lastMessageAt,
    };
  });

  return formatted;
}

async function markMassageAsDelivery({ conversationId }, context) {
  if (!context.userId) throw new Error('Authentication required');
  let msg = await messageModel.updateMany(
    {
      conversation: conversationId,
      receiver: context.userId,
      deliveryStatus: 'sent',
    },
    {
      $set: {
        deliveryStatus: 'delivered',
      },
    }
  );

  return true;
}

async function markMessagesAsRead({ conversationId }, context) {
  if (!context.userId) throw new Error('Authentication required');

  const conversation = await conversionSchema.findById(conversationId);
  if (!conversation) throw new Error('Conversation not found');

  const isParticipant = conversation.participants.some(
    id => id.toString() === context.userId
  );
  if (!isParticipant) throw new Error('Access denied');

  await Message.updateMany(
    {
      conversation: conversationId,
      receiver: context.userId,
      isRead: false,
      deliveryStatus: 'delivered',
    },
    {
      $set: { isRead: true, deliveryStatus: 'seen', readAt: new Date() },
    }
  );

  return true;
}

async function deleteMessage({ conversationId }, context) {
  if (!context.userId) throw new Error('Authentication required');
}

module.exports = {
  SendMessage,
  getMessages,
  getConversation,
  markMassageAsDelivery,
  markMessagesAsRead,
};
