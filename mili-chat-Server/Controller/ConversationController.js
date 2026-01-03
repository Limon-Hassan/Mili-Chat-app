const conversionSchema = require('../models/conversionSchema');
const messageModel = require('../models/messageModel');
const user = require('../models/user');

async function sendFirstMessage(
  { text, receiverId, type, mediaUrl, duration },
  context
) {
  if (!context.userId) throw new Error('Authentication required');

  let me = await user.findById(context.userId);
  if (!me) throw new Error('User not found');
  if (me.blockedUsers.includes(receiverId)) throw new Error('User is blocked');
  if (!me.friends.includes(receiverId))
    throw new Error('You are not friends with this user');

  const existingConversation = await conversionSchema.findOne({
    participants: { $all: [context.userId, receiverId] },
  });

  if (existingConversation) {
    throw new Error('Conversation already exists, use conversationId');
  }

  const newConversation = await conversionSchema.create({
    participants: [context.userId, receiverId],
    lastMessage: type === 'text' ? text : `[${type}]`,
    lastMessageType: type,
    lastMessageAt: new Date(),
  });

  const message = await messageModel.create({
    conversation: newConversation._id,
    sender: context.userId,
    receiver: receiverId,
    type,
    text: type === 'text' || type === 'link' ? text : undefined,
    mediaUrl: mediaUrl || undefined,
    duration: duration || undefined,
    deliveryStatus: 'sent',
  });

  await message.populate('sender', 'id name email');
  await message.populate('receiver', 'id name email');

  return message;
}

// async function SendMessage(
//   { conversationId, text, receiverId, mediaUrl, type, duration },
//   context
// ) {
//   if (!context.userId) throw new Error('Authentication required');

//   let allowedtypes = ['text', 'image', 'video', 'audio', 'link'];
//   if (!allowedtypes.includes(type)) {
//     throw new Error('Invalid message type');
//   }

//   let conversation = await conversionSchema.findById(conversationId);
//   if (!conversation) {
//     throw new Error('Conversation not found');
//   }

//   let isParticipant = conversation.participants.some(
//     pt => pt.toString() === context.userId
//   );

//   if (!isParticipant) {
//     throw new Error('You are not a participant in this conversation');
//   }

//   let message = new messageModel.create({
//     conversation: conversationId,
//     sender: context.userId,
//     receiver: receiverId,
//     type: type,
//     text: type === 'text' || type === 'link' ? text : undefined,
//     mediaUrl: mediaUrl || undefined,
//     duration: duration || undefined,
//     deliveryStatus: 'sent',
//   });

//   conversation.lastMessage =
//     type === 'text' || type === 'link' ? text : `[${type}]`;
//   conversation.lastMessageType = type;
//   conversation.lastMessageAt = new Date();

//   await conversation.save();
//   await message.populate('sender', 'id name email');
//   await message.populate('receiver', 'id name email');
//   return message;
// }

async function sendMessageWithId(
  { conversationId, text, type, mediaUrl, duration },
  context
) {
  if (!context.userId) throw new Error('Authentication required');

  if (!conversationId) throw new Error('conversationId is required');

  let me = await user.findById(context.userId);

  if (!me) throw new Error('User not found');

  let allowedtypes = ['text', 'image', 'video', 'audio', 'link'];
  if (!allowedtypes.includes(type)) {
    throw new Error('Invalid message type');
  }

  const conversation = await conversionSchema.findById(conversationId);
  if (!conversation) throw new Error('Invalid conversationId');

  let isParticipant = conversation.participants.some(
    pt => pt.toString() === context.userId
  );

  if (!isParticipant) {
    throw new Error('You are not a participant in this conversation');
  }

  const receiverId = conversation.participants.find(
    id => id.toString() !== context.userId
  );


  if (!receiverId) throw new Error('No receiver found');


  if (me.blockedUsers.includes(receiverId)) throw new Error('User is blocked');

  if (!me.friends.includes(receiverId)) {
    throw new Error('You are not friends with this user');
  }

  const message = await messageModel.create({
    conversation: conversationId,
    sender: context.userId,
    receiver: receiverId,
    type,
    text: type === 'text' || type === 'link' ? text : undefined,
    mediaUrl: mediaUrl || undefined,
    duration: duration || undefined,
    deliveryStatus: 'sent',
  });

  conversation.lastMessage = type === 'text' ? text : `[${type}]`;
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

  await messageModel.updateMany(
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

async function deleteMessage({ messageId }, context) {
  if (!context.userId) throw new Error('Authentication required');

  let message = await messageModel.findById(messageId);
  if (!message) throw new Error('Message not found');

  let allowedUsers =
    message.sender.toString() === context.userId ||
    message.receiver.toString() === context.userId;

  if (!allowedUsers) throw new Error('Access denied');

  await messageModel.findByIdAndDelete(messageId);
  return true;
}

async function deleteConversation({ conversationId }, context) {
  if (!context.userId) throw new Error('Authentication required');

  let conversation = await conversionSchema.findById(conversationId);
  if (!conversation) throw new Error('Conversation not found');

  let allowedUsers = conversation.participants.some(
    id => id.toString() === context.userId
  );

  if (!allowedUsers) throw new Error('Access denied');

  await messageModel.deleteMany({ conversation: conversationId });
  await conversionSchema.findByIdAndDelete(conversationId);
  return true;
}

async function editMessage({ messageId, newText }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }

  if (!newText || !newText.trim()) {
    throw new Error('Message text cannot be empty');
  }

  const message = await messageModel.findById(messageId);

  if (!message) {
    throw new Error('Message not found');
  }

  if (message.sender.toString() !== context.userId) {
    throw new Error('You can only edit your own message');
  }

  if (message.type !== 'text' && message.type !== 'link') {
    throw new Error('Only text or link messages can be edited');
  }

  message.text = newText;
  message.editedAt = new Date();

  await message.save();

  await message.populate('sender', 'id name');
  await message.populate('receiver', 'id name');

  return message;
}

async function reactToMessage({ messageId, emoji }, context) {
  if (!context.userId) throw new Error('Authentication required');

  const message = await messageModel.findById(messageId);
  if (!message) throw new Error('Message not found');

  const existingReaction = message.reactions.find(
    r => r.user.toString() === context.userId
  );

  if (existingReaction) {
    if (existingReaction.emoji === emoji) {
      message.reactions = message.reactions.filter(
        r => r.user.toString() !== context.userId
      );
    } else {
      existingReaction.emoji = emoji;
    }
  } else {
    message.reactions.push({
      user: context.userId,
      emoji,
    });
  }

  await message.save();
  await message.populate('sender', 'id name');
  await message.populate('receiver', 'id name');
  return message;
}

module.exports = {
  sendFirstMessage,
  sendMessageWithId,
  getMessages,
  getConversation,
  markMassageAsDelivery,
  markMessagesAsRead,
  deleteMessage,
  deleteConversation,
  editMessage,
  reactToMessage,
};
