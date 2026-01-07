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
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('joinUser', ({ userId }) => {
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

    socket.on('callUser', ({ toUserId, signalData, fromUserId }) => {
      const receivers = getSocketIds(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('incomingCall', { fromUserId, signalData });
      });
    });

    socket.on('answerCall', ({ toUserId, signalData }) => {
      const receivers = getSocketIds(toUserId);
      receivers.forEach(sId => {
        io.to(sId).emit('callAccepted', signalData);
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
