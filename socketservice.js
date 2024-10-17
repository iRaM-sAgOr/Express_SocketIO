import { Server } from 'socket.io';
import { config } from './config.js';
import jwt from 'jsonwebtoken';
import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

const users = {};           // Object to hold connected users in the authenticated namespace
const guestUsers = {};      // Object to hold connected users in the guest namespace

export function initializeSocket(server) {
  const pubClient = new Redis({
    host: "localhost",
    port: 6379,
  });
  const subClient = pubClient.duplicate();

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  // Set the Redis adapter for Socket.IO
  io.adapter(createAdapter(pubClient, subClient));

  // Authenticated namespace
  const authNamespace = io.of('/auth'); // Namespace for authenticated users

  authNamespace.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, config.token_secret, (err, user) => {
        if (err) return next(new Error('Authentication error'));
        socket.user = user; // Save the decoded user object to socket
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });

  authNamespace.on('connection', (socket) => {
    // Use socket.user for authenticated users
    const username = socket.user.username;
    users[socket.id] = socket.id;

    // Broadcast the updated user list to all clients in this namespace
    authNamespace.emit('user list', users);

    socket.on('public message', (msg) => {
      authNamespace.emit('public message', {
        userId: users[socket.id],
        message: msg,
      });
    });

    socket.on('private message', ({ recipientId, message }) => {
      socket.to(recipientId).emit('private message', {
        from: users[socket.id],
        message: message,
      });
    });

    socket.on('disconnect', () => {
      delete users[socket.id];
      authNamespace.emit('user list', users);
    });
  });

  // Guest namespace
  const guestNamespace = io.of('/guest'); // Namespace for guests

  guestNamespace.on('connection', (socket) => {
    const guestUsername = `Guest-${socket.id.substring(0, 5)}`;
    guestUsers[socket.id] = socket.id;

    guestNamespace.emit('user list', guestUsers);

    socket.on('public message', (msg) => {
      guestNamespace.emit('public message', {
        userId: guestUsers[socket.id],
        message: msg,
      });
    });

    socket.on('private message', ({ recipientId, message }) => {
      socket.to(recipientId).emit('private message', {
        from: guestUsers[socket.id],
        message: message,
      });
    });

    socket.on('disconnect', () => {
      delete guestUsers[socket.id];
      guestNamespace.emit('user list', guestUsers);
    });
  });
}