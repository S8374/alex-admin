import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { getApiBaseUrl } from '@/lib/api-base-url';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const socketUrl = getApiBaseUrl();
    const socketInstance = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
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
