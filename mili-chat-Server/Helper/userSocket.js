const onlineUsers = new Map();

function registerUser(socket, userId) {
  onlineUsers.set(userId, socket.id);
}

function removeUser(socketId) {
  for (let [userId, sId] of onlineUsers.entries()) {
    if (sId === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
}

function getSocketId(userId) {
  return onlineUsers.get(userId);
}

module.exports = { registerUser, removeUser, getSocketId };
