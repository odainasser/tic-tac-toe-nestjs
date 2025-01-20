import { io } from 'socket.io-client';

// Connect to the Socket.IO server
const socket = io('http://localhost:3000', {
  reconnectionAttempts: 5, // Limit the number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts
});

// Listen for connection event
socket.on('connect', () => {
  console.log('Connected to the server');
});

// Listen for custom events from GameGateway
socket.on('move', (data) => {
  console.log('Received move:', data);
});

socket.on('gameEvent', (data) => {
  console.log('Received gameEvent:', data);
});

// Handle disconnection
socket.on('disconnect', (reason) => {
  console.log(`Disconnected from the server: ${reason}`);
});

// Handle connection errors
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
