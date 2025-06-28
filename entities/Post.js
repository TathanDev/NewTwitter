import { DataTypes } from "sequelize";
import sequelize from "@/utils/sequelize";

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
    return await Post.findAll({
      attributes: [
        "*",
        [sequelize.fn("JSON_LENGTH", sequelize.col("likes")), "likes_count"],
      ],
    });
  },
};
