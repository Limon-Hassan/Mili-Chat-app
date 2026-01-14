import { io } from 'socket.io-client';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io('http://localhost:8080', {
      withCredentials: true,
      autoConnect: false,
      transports: ['polling', 'websocket'],
    });
  }
  return socket;
}
