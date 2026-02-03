const { Server } = require('socket.io');

const onlineUsers = new Map();

let io;

function registerUser(socket, userId) {
  if (onlineUsers.has(userId)) {
    const existing = onlineUsers.get(userId);
    if (!existing.includes(socket.id)) existing.push(socket.id);
    onlineUsers.set(userId, existing);
  } else {
    onlineUsers.set(userId, [socket.id]);
  }
  console.log('🟢 Online users:', onlineUsers);
}

function removeUser(socketId) {
  for (let [userId, socketIds] of onlineUsers.entries()) {
    const idx = socketIds.indexOf(socketId);
    if (idx !== -1) {
      socketIds.splice(idx, 1);
      if (socketIds.length === 0) onlineUsers.delete(userId);
      else onlineUsers.set(userId, socketIds);
      break;
    }
  }
  console.log('🔴 Online users after disconnect:', onlineUsers);
}

function getSocketIds(userId) {
  return onlineUsers.get(userId) || [];
}

function init(server) {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'https://mili-chat-app.vercel.app'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('joinUser', ({ userId }) => {
      socket.userId = userId;
      registerUser(socket, userId);
      socket.join(userId);
      console.log(`👤 User ${userId} joined their private room`);
    });

    socket.on('sendMessage', ({ toUserId, message }) => {
      const receivers = getSocketIds(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('receiveMessage', { from: socket.id, message });
      });
    });

    socket.on('typing', ({ toUserId }) => {
      const receivers = getSocketIds(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('typing', { from: socket.id });
      });
    });

    socket.on('call-user', ({ toUserId, callType }) => {
      if (!socket.userId) return;
      const receivers = getSocketIds(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('incoming-call', {
          fromUserId: socket.userId,
          callType,
        });
      });
    });

    socket.on('accept-call', ({ toUserId }) => {
      const receivers = getSocketIds(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('call-accepted', {
          fromUserId: socket.userId,
        });
      });
    });

    socket.on('reject-call', ({ toUserId }) => {
      const receivers = getSocketIds(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('call-rejected', {
          fromUserId: socket.userId,
        });
      });
    });

    socket.on('end-call', ({ toUserId }) => {
      const receivers = getSocketIds(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('call-ended');
      });
    });

    socket.on('webrtc-offer', ({ toUserId, offer }) => {
      getSocketIds(toUserId).forEach(sId => {
        io.to(sId).emit('webrtc-offer', {
          fromUserId: socket.userId,
          offer,
        });
      });
    });

    socket.on('webrtc-answer', ({ toUserId, answer }) => {
      getSocketIds(toUserId).forEach(sId => {
        io.to(sId).emit('webrtc-answer', {
          fromUserId: socket.userId,
          answer,
        });
      });
    });

    socket.on('ice-candidate', ({ toUserId, candidate }) => {
      getSocketIds(toUserId).forEach(sId => {
        io.to(sId).emit('ice-candidate', {
          fromUserId: socket.userId,
          candidate,
        });
      });
    });

    socket.on('joinUser', ({ userId }) => {
      registerUser(socket, userId);
      const yourFriends = getFavoriteFriends(userId); 
      yourFriends.forEach(friendId => {
        const sockets = getSocketIds(friendId);
        sockets.forEach(sId => {
          io.to(sId).emit('favorite-online', {
            friendId,
            name: socket.userName,
          });
        });
      });
    });

    socket.on('disconnect', () => {
      removeUser(socket.id);
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

module.exports = { init, getIO, registerUser, removeUser, getSocketIds };
