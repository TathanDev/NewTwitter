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
    return await Comment.findAll({
      where: { 
        post_id: postId,
        is_deleted: false 
      },
      include: [
        {
          model: Comment,
          as: 'Replies',
          where: { is_deleted: false },
          required: false,
        }
      ],
      order: [['comment_id', 'ASC']]
    });
  },

  async getCommentWithReplies(commentId) {
    return await Comment.findByPk(commentId, {
      include: [
        {
          model: Comment,
          as: 'Replies',
          where: { is_deleted: false },
          required: false,
        }
      ]
    });
  },

  async addLike(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Commentaire non trouvé");
    if (comment.is_deleted) throw new Error("Commentaire supprimé");

    if (!comment.likes.includes(userId)) {
      comment.likes = [...comment.likes, userId];
      await comment.save();
    }
    return comment;
  },

  async removeLike(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Commentaire non trouvé");

    comment.likes = comment.likes.filter((id) => id !== userId);
    await comment.save();
    return comment;
  },

  async hasUserLiked(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    return comment ? comment.likes.includes(userId) : false;
  },

  async deleteComment(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Commentaire non trouvé");
    if (comment.is_deleted) throw new Error("Commentaire déjà supprimé");

    // Vérifier que l'utilisateur est l'auteur
    // Note: ici on suppose que comment.author contient l'ID ou pseudo de l'utilisateur
    if (comment.author !== userId) {
      throw new Error("Vous n'êtes pas autorisé à supprimer ce commentaire");
    }

    // Marquer comme supprimé au lieu de supprimer complètement
    comment.is_deleted = true;
    comment.text = "[Commentaire supprimé]";
    await comment.save();
    
    return comment;
  },

  async getCommentsCount(postId) {
    return await Comment.count({
      where: { 
        post_id: postId,
        is_deleted: false 
      }
    });
  }
};
