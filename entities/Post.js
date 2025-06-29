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
      defaultValue: [], // <- Important: Un tableau vide en valeur par défaut
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

    // Assure que le champ likes est toujours un tableau
    let likesArray = Array.isArray(post.likes) ? post.likes : [];
    if (!likesArray.includes(userId)) {
      likesArray.push(userId);
      
      // Utiliser update direct pour forcer la mise à jour en base
      await Post.update(
        { likes: likesArray },
        { where: { post_id: postId } }
      );
      
      // Recharger l'instance
      await post.reload();
    }
    return post;
  },

  async removeLike(postId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post non trouvé");

    // Assure que le champ likes est toujours un tableau
    let likesArray = Array.isArray(post.likes) ? post.likes : [];
    likesArray = likesArray.filter((id) => id !== userId);
    
    // Utiliser update direct pour forcer la mise à jour en base
    await Post.update(
      { likes: likesArray },
      { where: { post_id: postId } }
    );
    
    // Recharger l'instance
    await post.reload();
    return post;
  },

  async hasUserLiked(postId, userId) {
    const post = await Post.findByPk(postId);
    // Assure que le champ likes est toujours un tableau
    return post ? (Array.isArray(post.likes) ? post.likes : []).includes(userId) : false;
  },

  async getPostsWithLikesCount() {
    const posts = await Post.findAll({
      order: [["post_id", "DESC"]], // Trier par ID décroissant (plus récents d'abord)
    });
    
    // Ajouter le nombre réel de likes et commentaires pour chaque post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const postData = post.toJSON();
        
        // S'assurer que likes est un tableau et calculer le nombre
        const likesArray = Array.isArray(postData.likes) ? postData.likes : [];
        const likesCount = likesArray.length;
        
        // Calculer le nombre réel de commentaires
        const commentsCount = await commentService.getCommentsCount(post.post_id);
        
        return {
          ...postData,
          likes: likesArray, // S'assurer que c'est un tableau
          likes_count: likesCount,
          comments_count: commentsCount
        };
      })
    );
    
    return postsWithComments;
  },

  async getPostWithComments(postId) {
    const post = await Post.findByPk(postId);
    
    if (!post) throw new Error("Post non trouvé");
    
    const postData = post.toJSON();
    
    // S'assurer que likes est un tableau et calculer le nombre
    const likesArray = Array.isArray(postData.likes) ? postData.likes : [];
    const likesCount = likesArray.length;
    
    const comments = await commentService.getCommentsByPostId(postId);
    const commentsCount = await commentService.getCommentsCount(postId);
    
    return {
      ...postData,
      likes: likesArray, // S'assurer que c'est un tableau
      likes_count: likesCount,
      comments: comments,
      comments_count: commentsCount
    };
  },
};
