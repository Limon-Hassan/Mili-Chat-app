let onlineUsers = new Map();

exports.addUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socketId);
};

exports.removeUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) return false;

  const sockets = onlineUsers.get(userId);
  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineUsers.delete(userId);
    return false; 
  }

  return true; 
};

exports.isUserOnline = userId => onlineUsers.has(userId);
exports.getSockets = userId =>
  onlineUsers.has(userId) ? [...onlineUsers.get(userId)] : [];
