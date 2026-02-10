const { Server } = require('socket.io');
const user = require('./models/user');
const { addUser, removeUser, getSockets } = require('./Helper/onlineUsers');
const messageModel = require('./models/messageModel');
const conversionSchema = require('./models/conversionSchema');

let io;

const activeChat = new Map();

function init(server) {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'https://mili-chat-app.onrender.com'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log('✅ Socket connected:', socket.id);
    socket.on('joinUser', async ({ userId }) => {
      socket.userId = userId;
      addUser(userId, socket.id);

      const friends = await getFavoriteFriends(userId);

      friends.forEach(friendId => {
        getSockets(friendId.toString()).forEach(sId => {
          io.to(sId).emit('friend-online', { userId, lastSeen: null });
        });
      });

      socket.heartbeat = setInterval(() => {
        if (!socket.connected) return;
        friends.forEach(friendId => {
          getSockets(friendId.toString()).forEach(sId => {
            io.to(sId).emit('friend-online', { userId, lastSeen: null });
          });
        });
      }, 10000);
    });

    socket.on('chat:open', async ({ conversationId }) => {
      if (!socket.userId) return;

      activeChat.set(socket.userId, conversationId);

      const conversation = await conversionSchema.findById(conversationId);
      if (!conversation) return;

      const unseenMessages = await messageModel.find({
        conversation: conversationId,
        receiver: socket.userId,
        deliveryStatus: { $ne: 'seen' },
      });

      const io = getIO();

      for (let msg of unseenMessages) {
        msg.deliveryStatus = 'seen';
        msg.isRead = true;
        msg.readAt = new Date();
        await msg.save();
        getSockets(msg.sender.toString()).forEach(sId => {
          io.to(sId).emit('messageSeen', {
            messageId: msg._id.toString(),
            conversationId,
          });
        });
      }
    });

    socket.on('chat:close', () => {
      if (!socket.userId) return;
      activeChat.delete(socket.userId);
    });

    socket.on('disconnect:chatClose', () => {
      activeChat.delete(socket.userId);
    });

    socket.on(
      'sendMessage',
      async ({ toUserId, messageId, conversationId }) => {
        const receivers = getSockets(toUserId);

        receivers.forEach(sId => {
          io.to(sId).emit('receiveMessage', {
            from: socket.userId,
            messageId,
          });
        });

        const receiverActiveConversation = activeChat.get(toUserId);

        if (receiverActiveConversation === conversationId) {
          const msg = await messageModel.findById(messageId);
          if (!msg) return;

          msg.deliveryStatus = 'seen';
          msg.isRead = true;
          msg.readAt = new Date();
          await msg.save();

          getSockets(socket.userId).forEach(sId => {
            io.to(sId).emit('messageSeen', {
              messageId: messageId,
              conversationId,
            });
          });
        } else {
          getSockets(toUserId).forEach(sId => {
            io.to(sId).emit('messageDelivered', { messageId });
          });
        }
      },
    );

    socket.on('typing', ({ toUserId }) => {
      if (!socket.userId) return;
      const receivers = getSockets(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('typing', { from: socket.userId });
      });
    });

    socket.on('call-user', ({ toUserId, callType }) => {
      if (!socket.userId) return;
      const receivers = getSockets(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('incoming-call', {
          fromUserId: socket.userId,
          callType,
        });
      });
    });

    socket.on('accept-call', ({ toUserId }) => {
      const receivers = getSockets(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('call-accepted', {
          fromUserId: socket.userId,
        });
      });
    });

    socket.on('reject-call', ({ toUserId }) => {
      const receivers = getSockets(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('call-rejected', {
          fromUserId: socket.userId,
        });
      });
    });

    socket.on('end-call', ({ toUserId }) => {
      const receivers = getSockets(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('call-ended');
      });
    });

    socket.on('webrtc-offer', ({ toUserId, offer }) => {
      getSockets(toUserId).forEach(sId => {
        io.to(sId).emit('webrtc-offer', {
          fromUserId: socket.userId,
          offer,
        });
      });
    });

    socket.on('webrtc-answer', ({ toUserId, answer }) => {
      getSockets(toUserId).forEach(sId => {
        io.to(sId).emit('webrtc-answer', {
          fromUserId: socket.userId,
          answer,
        });
      });
    });

    socket.on('ice-candidate', ({ toUserId, candidate }) => {
      getSockets(toUserId).forEach(sId => {
        io.to(sId).emit('ice-candidate', {
          fromUserId: socket.userId,
          candidate,
        });
      });
    });

    socket.on('disconnect', async () => {
      clearInterval(socket.heartbeat);
      const userId = socket.userId;
      if (!userId) return;
      const stillOnline = removeUser(userId, socket.id);
      if (!stillOnline) {
        const lastSeen = new Date();
        await user.findByIdAndUpdate(userId, { lastSeen });

        const friends = await getFavoriteFriends(userId);
        friends.forEach(friendId => {
          getSockets(friendId.toString()).forEach(sId => {
            io.to(sId).emit('friend-offline', { userId, lastSeen });
          });
        });
      }
      console.log('disconnecting', socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

async function getFavoriteFriends(userId) {
  const me = await user.findById(userId).select('friends');
  return me?.friends || [];
}

module.exports = { init, getIO, addUser, removeUser, getSockets, activeChat };
