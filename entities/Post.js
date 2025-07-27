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
    // Nouveau : structure JSON pour le contenu modulaire
    content_structure: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Structure des composants du post"
    },
    // Nouveau : configuration de style global
    style_config: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: "Configuration du style (background, theme, etc.)"
    },
    // Ancien champ maintenu pour compatibilité
    text: {
      type: DataTypes.TEXT, // Étendu pour textes plus longs
      allowNull: true, // Maintenant optionnel
    },
    // Ancien champ maintenu pour compatibilité
    media: {
      type: DataTypes.TEXT, // Peut contenir plusieurs URLs séparées
      allowNull: true,
    },
    // Nouveau : version du format
    content_version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: "Version du format de contenu pour migration"
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
        
        // S'assurer que les champs JSON sont correctement parsés
        let contentStructure = postData.content_structure;
        if (typeof contentStructure === 'string') {
          try {
            contentStructure = JSON.parse(contentStructure);
          } catch (e) {
            console.error('Erreur lors du parsing de content_structure:', e);
            contentStructure = null;
          }
        }
        
        let styleConfig = postData.style_config;
        if (typeof styleConfig === 'string') {
          try {
            styleConfig = JSON.parse(styleConfig);
          } catch (e) {
            console.error('Erreur lors du parsing de style_config:', e);
            styleConfig = {};
          }
        }
        
        return {
          ...postData,
          likes: likesArray, // S'assurer que c'est un tableau
          likes_count: likesCount,
          comments_count: commentsCount,
          content_structure: contentStructure,
          style_config: styleConfig || {}
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
    
    // S'assurer que les champs JSON sont correctement parsés
    let contentStructure = postData.content_structure;
    if (typeof contentStructure === 'string') {
      try {
        contentStructure = JSON.parse(contentStructure);
      } catch (e) {
        console.error('Erreur lors du parsing de content_structure:', e);
        contentStructure = null;
      }
    }
    
    let styleConfig = postData.style_config;
    if (typeof styleConfig === 'string') {
      try {
        styleConfig = JSON.parse(styleConfig);
      } catch (e) {
        console.error('Erreur lors du parsing de style_config:', e);
        styleConfig = {};
      }
    }
    
    return {
      ...postData,
      likes: likesArray, // S'assurer que c'est un tableau
      likes_count: likesCount,
      comments: comments,
      comments_count: commentsCount,
      content_structure: contentStructure,
      style_config: styleConfig || {}
    };
  },
};
