import { DataTypes } from "sequelize";
import sequelize from "@/utils/sequelize";
import { commentService } from "./Comment";

const Post = sequelize.define(
  "UsPosters",
  {
    post_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    author: {
      type: DataTypes.STRING(255),
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    media: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    likes: {
      type: DataTypes.JSON,
      defaultValue: 0,
      allowNull: false,
    },
    share_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    comments: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
  },
  {
    tableName: "Posts",
  }
);

export default Post;

export const postService = {
  async addLike(postId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post non trouvé");

    if (!post.likes.includes(userId)) {
      post.likes = [...post.likes, userId];
      await post.save();
    }
    return post;
  },

  async removeLike(postId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post non trouvé");

    post.likes = post.likes.filter((id) => id !== userId);
    await post.save();
    return post;
  },

  async hasUserLiked(postId, userId) {
    const post = await Post.findByPk(postId);
    return post ? post.likes.includes(userId) : false;
  },

  async getPostsWithLikesCount() {
    const posts = await Post.findAll({
      attributes: [
        "*",
        [sequelize.fn("JSON_LENGTH", sequelize.col("likes")), "likes_count"],
      ],
    });
    
    // Ajouter le nombre réel de commentaires pour chaque post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await commentService.getCommentsCount(post.post_id);
        return {
          ...post.toJSON(),
          comments_count: commentsCount
        };
      })
    );
    
    return postsWithComments;
  },

  async getPostWithComments(postId) {
    const post = await Post.findByPk(postId, {
      attributes: [
        "*",
        [sequelize.fn("JSON_LENGTH", sequelize.col("likes")), "likes_count"],
      ],
    });
    
    if (!post) throw new Error("Post non trouvé");
    
    const comments = await commentService.getCommentsByPostId(postId);
    const commentsCount = await commentService.getCommentsCount(postId);
    
    return {
      ...post.toJSON(),
      comments: comments,
      comments_count: commentsCount
    };
  },
};
