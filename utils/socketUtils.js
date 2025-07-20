import { notificationService } from '@/entities/Notification';

// Fonction pour émettre une notification en temps réel
export async function emitNotification(io, recipientId, type, senderId = null) {
  try {
    // Récupérer le nombre de notifications non lues
    const notificationCount = await notificationService.getUnreadCount(recipientId);
    
    // Émettre la mise à jour du nombre de notifications
    io.to(`user-${recipientId}`).emit('notification-update', { count: notificationCount });
    
    // Émettre l'événement de nouvelle notification
    io.to(`user-${recipientId}`).emit('new-notification', { 
      type, 
      senderId: senderId || null,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Notification ${type} envoyée à l'utilisateur ${recipientId} (count: ${notificationCount})`);
  } catch (error) {
    console.error('Erreur lors de l\'émission de la notification temps réel:', error);
  }
}

// Fonction pour obtenir l'instance Socket.IO depuis n'importe où
export function getSocketIO(req = null, res = null) {
  // Si nous sommes dans une API route, utiliser res.socket.server.io
  if (res && res.socket && res.socket.server && res.socket.server.io) {
    return res.socket.server.io;
  }
  
  // Sinon, essayer d'accéder à l'instance globale
  if (global.io) {
    return global.io;
  }
  
  return null;
}
