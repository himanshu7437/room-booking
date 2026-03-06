import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Room availability channel
export const joinRoomChannel = (roomId) => {
  const socket = getSocket();
  socket.emit('joinRoom', roomId);
};

export const leaveRoomChannel = (roomId) => {
  const socket = getSocket();
  socket.emit('leaveRoom', roomId);
};

export const onAvailabilityUpdate = (callback) => {
  const socket = getSocket();
  socket.on('availabilityUpdate', callback);
};

export const offAvailabilityUpdate = (callback) => {
  const socket = getSocket();
  socket.off('availabilityUpdate', callback);
};
