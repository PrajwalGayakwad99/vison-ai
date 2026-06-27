import { io } from 'socket.io-client';

// Stub socket connection for category 4 features (Collaboration & Social Learning)
const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 3,
});
