const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      recipient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id_user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: "ID de l'utilisateur qui reçoit la notification",
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id_user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: "ID de l'utilisateur qui a déclenché la notification (peut être null pour les notifications système)",
      },
      type: {
        type: DataTypes.ENUM('mention', 'comment', 'like', 'follow', 'message'),
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    });

    // Créer des index pour optimiser les performances
    await queryInterface.addIndex('Notifications', ['recipient_id'], {
      name: 'idx_notifications_recipient_id'
    });

    await queryInterface.addIndex('Notifications', ['recipient_id', 'is_read'], {
      name: 'idx_notifications_recipient_read'
    });

    await queryInterface.addIndex('Notifications', ['created_at'], {
      name: 'idx_notifications_created_at'
    });

    await queryInterface.addIndex('Notifications', ['type'], {
      name: 'idx_notifications_type'
    });
  },

  async down(queryInterface, Sequelize) {
    // Supprimer les index
    await queryInterface.removeIndex('Notifications', 'idx_notifications_recipient_id');
    await queryInterface.removeIndex('Notifications', 'idx_notifications_recipient_read');
    await queryInterface.removeIndex('Notifications', 'idx_notifications_created_at');
    await queryInterface.removeIndex('Notifications', 'idx_notifications_type');
    
    // Supprimer la table
    await queryInterface.dropTable('Notifications');
  }
};
