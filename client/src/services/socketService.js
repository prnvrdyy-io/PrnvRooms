/**
 * Socket.io Client Service
 * 
 * Manages the singleton connection to our backend WebSocket server.
 */

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        // Optional: transits can be restricted to 'websocket' for better performance
        // transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log(`[Socket] Connected with ID: ${this.socket.id}`);
      });

      this.socket.on('connect_error', (err) => {
        console.error('[Socket] Connection Error:', err.message);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
