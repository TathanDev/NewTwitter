import { DataTypes } from "sequelize";
import sequelize from "@/utils/sequelize";

const Comment = sequelize.define(
  "Comment",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'post_id'
      }
    },
    parent_comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // null si c'est un commentaire principal, sinon ID du commentaire parent
      references: {
        model: 'Comments',
        key: 'comment_id'
      }
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT, // Utiliser TEXT pour des commentaires plus longs
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    likes: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  },
  {
    tableName: "Comments",
    timestamps: false,
  }
);

// Définir les associations
Comment.belongsTo(Comment, { 
  as: 'ParentComment', 
  foreignKey: 'parent_comment_id' 
});

Comment.hasMany(Comment, { 
  as: 'Replies', 
  foreignKey: 'parent_comment_id' 
});

export default Comment;

export const commentService = {
  async createComment(postId, parentCommentId, author, text) {
    const comment = await Comment.create({
      post_id: postId,
      parent_comment_id: parentCommentId,
      author: author,
      text: text,
      time: new Date().toISOString(),
      likes: [],
      is_deleted: false
    });
    return comment;
  },

  async getCommentsByPostId(postId) {
    const comments = await Comment.findAll({
      where: { 
        post_id: postId
      },
      include: [
        {
          model: Comment,
          as: 'Replies',
          required: false,
          include: [
            {
              model: Comment,
              as: 'Replies',
              required: false,
            }
          ]
        }
      ],
      order: [
        ['comment_id', 'DESC'], // Plus récents d'abord
        [{ model: Comment, as: 'Replies' }, 'comment_id', 'ASC']
      ]
    });

    // Organiser les commentaires de manière hiérarchique
    return this.organizeCommentsHierarchy(comments);
  },

  async getCommentWithReplies(commentId) {
    return await Comment.findByPk(commentId, {
      include: [
        {
          model: Comment,
          as: 'Replies',
          required: false,
        }
      ]
    });
  },

  async addLike(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Commentaire non trouvé");

    const likesArray = Array.isArray(comment.likes) ? comment.likes : [];
    if (!likesArray.includes(userId)) {
      comment.likes = [...likesArray, userId];
      await comment.save();
    }
    return comment;
  },

  async removeLike(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Commentaire non trouvé");

    const likesArray = Array.isArray(comment.likes) ? comment.likes : [];
    comment.likes = likesArray.filter((id) => id !== userId);
    await comment.save();
    return comment;
  },

  async hasUserLiked(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    return comment ? comment.likes.includes(userId) : false;
  },

  async updateComment(commentId, userId, newText) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Commentaire non trouvé");

    // Vérifier que l'utilisateur est l'auteur
    if (comment.author !== userId) {
      throw new Error("Vous n'êtes pas autorisé à modifier ce commentaire");
    }

    // Mettre à jour le texte
    comment.text = newText.trim();
    await comment.save();
    
    return comment;
  },

  async deleteComment(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Commentaire non trouvé");

    // Vérifier que l'utilisateur est l'auteur
    if (comment.author !== userId) {
      throw new Error("Vous n'êtes pas autorisé à supprimer ce commentaire");
    }

    // Supprimer d'abord toutes les réponses à ce commentaire
    await Comment.destroy({
      where: {
        parent_comment_id: commentId
      }
    });

    // Puis supprimer le commentaire lui-même
    await comment.destroy();
    
    return { success: true };
  },

  async getCommentsCount(postId) {
    return await Comment.count({
      where: { 
        post_id: postId
      }
    });
  },

  // Organise les commentaires en hiérarchie parent-enfant
  organizeCommentsHierarchy(comments) {
    const commentMap = new Map();
    const topLevelComments = [];

    // Première passe : créer la map de tous les commentaires
    comments.forEach(comment => {
      const commentData = comment.toJSON ? comment.toJSON() : comment;
      commentData.Replies = commentData.Replies || [];
      commentData.repliesCount = commentData.Replies.length;
      commentMap.set(commentData.comment_id, commentData);
    });

    // Deuxième passe : organiser la hiérarchie
    comments.forEach(comment => {
      const commentData = commentMap.get(comment.comment_id);
      if (!commentData.parent_comment_id) {
        topLevelComments.push(commentData);
      }
    });

    return topLevelComments;
  },

  // Méthode pour obtenir les statistiques détaillées
  async getPostCommentsStats(postId) {
    const totalCount = await this.getCommentsCount(postId);
    const topLevelCount = await Comment.count({
      where: { 
        post_id: postId,
        parent_comment_id: null
      }
    });
    
    return {
      total: totalCount,
      topLevel: topLevelCount,
      replies: totalCount - topLevelCount
    };
  }
};
