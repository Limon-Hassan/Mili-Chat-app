import { io } from 'socket.io-client';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io('https://mili-chat-app-server.onrender.com', {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket'],
    });
  }
  return socket;
}


