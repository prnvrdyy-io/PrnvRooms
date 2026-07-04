/**
 * Socket.io Server Setup & Signaling Logic
 * 
 * This module handles all WebRTC signaling.
 * WebRTC requires clients to exchange SDP offers/answers and ICE candidates 
 * to establish a peer-to-peer connection. We use Socket.io as the signaling channel.
 * 
 * Topology: Mesh (Every client connects to every other client)
 */

const { Server } = require('socket.io');

const initSocketIO = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // --- Room Management ---
    
    // User joins a meeting room
    socket.on('join-room', ({ roomId, user }) => {
      socket.join(roomId);
      console.log(`👤 User ${user.username} (${socket.id}) joined room ${roomId}`);
      
      // Tell everyone else in the room that a new user joined
      // so they can initiate a WebRTC connection (offer) to this new user.
      socket.to(roomId).emit('user-connected', {
        userId: user._id,
        socketId: socket.id,
        username: user.username,
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
        // Notify others in the room to remove this user's video element
        socket.to(roomId).emit('user-disconnected', socket.id);
      });
    });

    // --- WebRTC Signaling (Mesh Topology) ---
    // In a mesh topology, when a new user joins, existing users send an 'offer'.
    // The new user replies with an 'answer'.
    // Both sides exchange 'ice-candidates' to find the best network path.

    // 1. Relay SDP Offer
    socket.on('offer', ({ offer, to }) => {
      socket.to(to).emit('offer', {
        offer,
        from: socket.id,
      });
    });

    // 2. Relay SDP Answer
    socket.on('answer', ({ answer, to }) => {
      socket.to(to).emit('answer', {
        answer,
        from: socket.id,
      });
    });

    // 3. Relay ICE Candidates
    socket.on('ice-candidate', ({ candidate, to }) => {
      socket.to(to).emit('ice-candidate', {
        candidate,
        from: socket.id,
      });
    });

    // --- Chat & Collaboration ---
    
    // Relay chat message to everyone in the room
    socket.on('chat-message', ({ roomId, message, sender }) => {
      socket.to(roomId).emit('chat-message', {
        message,
        sender,
        timestamp: new Date().toISOString(),
      });
    });

    // Hand Raising
    socket.on('hand-toggle', ({ roomId, isRaised }) => {
      // Broadcast to everyone else in the room
      socket.to(roomId).emit('hand-toggle', {
        socketId: socket.id,
        isRaised
      });
    });

    // Admin Controls
    socket.on('admin-mute-all', ({ roomId }) => {
      // Broadcast a force-mute command to everyone else in the room
      socket.to(roomId).emit('force-mute');
    });

    // Meeting Reactions
    socket.on('meeting-reaction', ({ roomId, emoji, sender }) => {
      // Generate a unique ID for the reaction on the backend or pass it through
      // Actually, we can just pass it through so everyone renders the exact same reaction object
      socket.to(roomId).emit('meeting-reaction', {
        emoji,
        sender,
        id: Math.random().toString(36).substring(2, 9),
      });
    });
  });

  return io;
};

module.exports = { initSocketIO };
