import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_BASE_API?.trim() || 'http://localhost:51212';
    const socketInstance = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Admin connected to socket server');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Admin socket connection error:', err.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return socket;
};
