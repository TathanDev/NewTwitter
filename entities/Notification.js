import { DataTypes } from "sequelize";
import sequelize from "@/utils/sequelize";

const Notification = sequelize.define(
  "Notifications",
  {
    notification_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID de l'utilisateur qui reçoit la notification",
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID de l'utilisateur qui a déclenché la notification (peut être null pour les notifications système)",
    },
    type: {
      type: DataTypes.ENUM('mention', 'comment', 'like', 'follow', 'message', 'reply'),
      allowNull: false,
      comment: "Type de notification",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Titre court de la notification",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Contenu détaillé de la notification",
    },
    related_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID de l'entité liée (post_id, comment_id, etc.)",
    },
    related_type: {
      type: DataTypes.ENUM('post', 'comment', 'user', 'message'),
      allowNull: true,
      comment: "Type de l'entité liée",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Métadonnées supplémentaires pour la notification (JSON)",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "Notifications",
    timestamps: false,
  }
);

export default Notification;

export const notificationService = {
  // Créer une nouvelle notification
  async createNotification({
    recipientId,
    senderId = null,
    type,
    title,
    content,
    relatedId = null,
    relatedType = null,
    metadata = null
  }) {
    try {
      // Éviter les auto-notifications
      if (senderId === recipientId) {
        return null;
      }

      const notification = await Notification.create({
        recipient_id: recipientId,
        sender_id: senderId,
        type,
        title,
        content,
        related_id: relatedId,
        related_type: relatedType,
        metadata,
      });

      return notification;
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error);
      throw error;
    }
  },

  // Récupérer les notifications d'un utilisateur
  async getNotificationsByUser(userId, limit = 20) {
    try {
      const notifications = await Notification.findAll({
        where: { recipient_id: userId },
        order: [["created_at", "DESC"]],
        limit,
      });

      return notifications;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      throw error;
    }
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId) {
    try {
      await Notification.update(
        { is_read: true },
        { where: { notification_id: notificationId } }
      );
    } catch (error) {
      console.error("Erreur lors du marquage de la notification:", error);
      throw error;
    }
  },

  // Marquer toutes les notifications d'un utilisateur comme lues
  async markAllAsRead(userId) {
    try {
      await Notification.update(
        { is_read: true },
        { where: { recipient_id: userId, is_read: false } }
      );
    } catch (error) {
      console.error("Erreur lors du marquage des notifications:", error);
      throw error;
    }
  },

  // Compter les notifications non lues
  async getUnreadCount(userId) {
    try {
      const count = await Notification.count({
        where: { recipient_id: userId, is_read: false },
      });
      return count;
    } catch (error) {
      console.error("Erreur lors du comptage des notifications:", error);
      return 0;
    }
  },

  // Supprimer une notification
  async deleteNotification(notificationId) {
    try {
      await Notification.destroy({
        where: { notification_id: notificationId },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      throw error;
    }
  },

  // Créer une notification de mention
  async createMentionNotification(recipientId, senderId, postId, postType = 'post') {
    return this.createNotification({
      recipientId,
      senderId,
      type: 'mention',
      title: 'Nouvelle mention',
      content: `Vous avez été mentionné(e) dans un ${postType === 'post' ? 'post' : 'commentaire'}.`,
      relatedId: postId,
      relatedType: postType,
    });
  },

  // Créer une notification de commentaire
  async createCommentNotification(recipientId, senderId, postId) {
    return this.createNotification({
      recipientId,
      senderId,
      type: 'comment',
      title: 'Nouveau commentaire',
      content: 'Quelqu\'un a commenté votre post.',
      relatedId: postId,
      relatedType: 'post',
    });
  },

  // Créer une notification de like
  async createLikeNotification(recipientId, senderId, postId, likeType = 'post') {
    return this.createNotification({
      recipientId,
      senderId,
      type: 'like',
      title: 'Nouveau like',
      content: `Quelqu'un a liké votre ${likeType === 'post' ? 'post' : 'commentaire'}.`,
      relatedId: postId,
      relatedType: likeType,
    });
  },

  // Créer une notification de follow
  async createFollowNotification(recipientId, senderId) {
    return this.createNotification({
      recipientId,
      senderId,
      type: 'follow',
      title: 'Nouvel abonné',
      content: 'Quelqu\'un s\'est abonné à vous.',
      relatedId: senderId,
      relatedType: 'user',
    });
  },

  // Créer une notification de message
  async createMessageNotification(recipientId, senderId) {
    return this.createNotification({
      recipientId,
      senderId,
      type: 'message',
      title: 'Nouveau message',
      content: 'Vous avez reçu un nouveau message privé.',
      relatedId: senderId,
      relatedType: 'user',
    });
  },

  // Créer une notification de réponse à un commentaire
  async createReplyNotification(recipientId, senderId, commentId, metadata = {}) {
    return this.createNotification({
      recipientId,
      senderId,
      type: 'reply',
      title: 'Nouvelle réponse',
      content: 'Quelqu\'un a répondu à votre commentaire.',
      relatedId: commentId,
      relatedType: 'comment',
      metadata: {
        comment_id: commentId,
        post_id: metadata.post_id,
        ...metadata
      }
    });
  },
};
