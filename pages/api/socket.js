import { Server } from 'socket.io';
import { messageService } from '../../entities/Message.js';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket server already running');
    res.end();
    return;
  }

  console.log('Initializing Socket.IO server');
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user to their personal room
    socket.on('join-user', (userId) => {
      socket.join(`user-${userId}`);
      socket.userId = userId;
      console.log(`User ${userId} joined personal room`);
    });

    // Join specific conversation
    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Leave conversation
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User left conversation: ${conversationId}`);
    });

    // Handle new message
    socket.on('send-message', async (messageData) => {
      try {
        console.log('Received message:', messageData);
        
        const { senderId, receiverId, content, messageType = 'text', mediaUrl = null } = messageData;

        // Save message to database
        const message = await messageService.sendMessage(
          parseInt(senderId),
          parseInt(receiverId), 
          content,
          messageType,
          mediaUrl
        );

        // Generate conversation ID
        const conversationId = messageService.generateConversationId(senderId, receiverId);

        // Create message object to send
        const messageToSend = {
          message_id: message.message_id,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          conversation_id: conversationId,
          content: message.content,
          message_type: message.message_type,
          media_url: message.media_url,
          is_read: message.is_read,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt
        };

        // Send to conversation room
        io.to(conversationId).emit('new-message', messageToSend);
        
        // Send to both users' personal rooms for notifications
        io.to(`user-${senderId}`).emit('new-message', messageToSend);
        io.to(`user-${receiverId}`).emit('new-message', messageToSend);

        // Send updated unread count to receiver
        const unreadCount = await messageService.getUnreadCount(parseInt(receiverId));
        io.to(`user-${receiverId}`).emit('unread-count-update', { unreadCount });

        console.log(`Message sent in conversation ${conversationId}`);
        console.log(`Unread count for user ${receiverId}: ${unreadCount}`);

        // Confirm to sender
        socket.emit('message-sent', { success: true, message: messageToSend });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message-error', { error: error.message });
      }
    });

    // Mark messages as read
    socket.on('mark-read', async (data) => {
      try {
        const { conversationId, userId } = data;
        await messageService.markMessagesAsRead(conversationId, userId);
        
        // Notify conversation that messages were read
        socket.to(conversationId).emit('messages-read', {
          conversationId,
          readByUserId: userId,
          readAt: new Date()
        });
        
        console.log(`Messages marked as read by user ${userId} in ${conversationId}`);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { conversationId, userId, userName } = data;
      socket.to(conversationId).emit('user-typing', { userId, userName });
    });

    socket.on('typing-stop', (data) => {
      const { conversationId, userId } = data;
      socket.to(conversationId).emit('user-stop-typing', { userId });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  res.end();
};

export default SocketHandler;
