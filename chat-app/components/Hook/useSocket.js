'use client';
import { getSocket } from '@/lib/socket';
import { useEffect, useRef } from 'react';

export function useSocket({ userId, onEvents = {} } = {}) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🟢 Socket connected:', socket.id);

      if (userId) {
        socket.emit('joinUser', { userId });
        console.log('👤 joinUser emitted:', userId);
      }
    });

    socket.on('connect_error', err => {
      console.error('❌ Socket error:', err.message);
    });

    Object.entries(onEvents).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    socket.connect();

    return () => {
      socket.removeAllListeners();
    };
  }, [userId]);

  return socketRef.current;
}



