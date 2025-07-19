import { DataTypes } from "sequelize";
import sequelize from "@/utils/sequelize";

const Message = sequelize.define(
  "Messages",
  {
    message_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID de l'utilisateur qui envoie le message",
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID de l'utilisateur qui reçoit le message",
    },
    conversation_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "ID unique pour la conversation entre deux utilisateurs",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Contenu du message",
    },
    message_type: {
      type: DataTypes.STRING,
      defaultValue: "text",
      allowNull: false,
      validate: {
        isIn: [["text", "image", "file"]],
      },
    },
    media_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "URL du média (image/fichier) si applicable",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    reply_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID du message auquel on répond (pour les réponses)",
    },
  },
  {
    tableName: "Messages",
    timestamps: true, // Override global setting for this model
    freezeTableName: true,
    indexes: [
      {
        fields: ["conversation_id"],
      },
      {
        fields: ["sender_id"],
      },
      {
        fields: ["receiver_id"],
      },
      {
        fields: ["is_read"],
      },
    ],
  }
);

export default Message;

// Service pour gérer les opérations de messagerie
export const messageService = {
  // Générer un ID de conversation unique entre deux utilisateurs
  generateConversationId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort((a, b) => a - b);
    return `conv_${sortedIds[0]}_${sortedIds[1]}`;
  },

  // Envoyer un nouveau message
  async sendMessage(senderId, receiverId, content, messageType = "text", mediaUrl = null, replyTo = null) {
    const conversationId = this.generateConversationId(senderId, receiverId);
    
    const message = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      conversation_id: conversationId,
      content,
      message_type: messageType,
      media_url: mediaUrl,
      reply_to: replyTo,
    });

    return message;
  },

  // Récupérer toutes les conversations d'un utilisateur
  async getUserConversations(userId) {
    const messages = await Message.findAll({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ],
        is_deleted: false,
      },
      order: [["createdAt", "DESC"]],
    });

    // Grouper par conversation et récupérer le dernier message de chaque conversation
    const conversations = {};
    const conversationPartners = new Set();

    for (const message of messages) {
      const { conversation_id } = message;
      
      if (!conversations[conversation_id]) {
        const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        conversationPartners.add(partnerId);
        conversations[conversation_id] = {
          conversation_id,
          partner_id: partnerId,
          last_message: message,
          unread_count: 0,
        };
      }

      // Compter les messages non lus
      if (message.receiver_id === userId && !message.is_read) {
        conversations[conversation_id].unread_count++;
      }
    }

    return Object.values(conversations);
  },

  // Récupérer les messages d'une conversation
  async getConversationMessages(conversationId, limit = 50, offset = 0) {
    const messages = await Message.findAll({
      where: {
        conversation_id: conversationId,
        is_deleted: false,
      },
      order: [["createdAt", "ASC"]],
      limit,
      offset,
    });

    return messages;
  },

  // Marquer les messages comme lus
  async markMessagesAsRead(conversationId, userId) {
    await Message.update(
      {
        is_read: true,
        read_at: new Date(),
      },
      {
        where: {
          conversation_id: conversationId,
          receiver_id: userId,
          is_read: false,
        },
      }
    );
  },

  // Supprimer un message
  async deleteMessage(messageId, userId) {
    const message = await Message.findByPk(messageId);
    
    if (!message || message.sender_id !== userId) {
      throw new Error("Message non trouvé ou non autorisé");
    }

    await Message.update(
      { is_deleted: true },
      { where: { message_id: messageId } }
    );

    return true;
  },

  // Modifier un message
  async editMessage(messageId, userId, newContent) {
    const message = await Message.findByPk(messageId);
    
    if (!message || message.sender_id !== userId) {
      throw new Error("Message non trouvé ou non autorisé");
    }

    await Message.update(
      {
        content: newContent,
        edited_at: new Date(),
      },
      { where: { message_id: messageId } }
    );

    return await Message.findByPk(messageId);
  },

  // Compter les messages non lus pour un utilisateur
  async getUnreadCount(userId) {
    const count = await Message.count({
      where: {
        receiver_id: userId,
        is_read: false,
        is_deleted: false,
      },
    });

    return count;
  },

  // Rechercher des messages
  async searchMessages(userId, query, conversationId = null) {
    const whereClause = {
      [sequelize.Sequelize.Op.or]: [
        { sender_id: userId },
        { receiver_id: userId }
      ],
      content: {
        [sequelize.Sequelize.Op.like]: `%${query}%`
      },
      is_deleted: false,
    };

    if (conversationId) {
      whereClause.conversation_id = conversationId;
    }

    const messages = await Message.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    return messages;
  },

  // Supprimer une conversation entière
  async deleteConversation(conversationId, userId) {
    // Vérifier que l'utilisateur fait partie de la conversation
    const userMessages = await Message.findOne({
      where: {
        conversation_id: conversationId,
        [sequelize.Sequelize.Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ],
        is_deleted: false,
      },
    });

    if (!userMessages) {
      return false; // Conversation non trouvée ou utilisateur non autorisé
    }

    // Marquer tous les messages de la conversation comme supprimés
    const [affectedRows] = await Message.update(
      { is_deleted: true },
      {
        where: {
          conversation_id: conversationId,
          is_deleted: false,
        },
      }
    );

    return affectedRows > 0;
  },
};
