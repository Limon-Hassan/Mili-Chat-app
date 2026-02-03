import { io } from 'socket.io-client';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_SERVER_PORT, {
      withCredentials: true,
      autoConnect: false,
      transports: ['polling', 'websocket'],
    });
  }
  return socket;
}

export function notifyFavoriteOnline(userId) {
  getSocket().emit('favorite-online', { userId });
}
