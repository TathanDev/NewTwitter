import { NextResponse } from "next/server";
import { Op } from "sequelize";
import Post from "@/entities/Post";
import User from "@/entities/User";
import Comment from "@/entities/Comment";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Le terme de recherche doit contenir au moins 2 caractères",
        },
        { status: 400 }
      );
    }

    const searchTerm = query.trim();
    const offset = (page - 1) * limit;

    let results = {};

    switch (type) {
      case "posts":
        results = await searchPosts(searchTerm, limit, offset);
        break;
      case "users":
        results = await searchUsers(searchTerm, limit, offset);
        break;
      case "comments":
        results = await searchComments(searchTerm, limit, offset);
        break;
      case "hashtags":
        results = await searchHashtags(searchTerm, limit, offset);
        break;
      default: // 'all'
        results = await globalSearch(searchTerm, limit, offset);
    }

    return NextResponse.json({
      success: true,
      query: searchTerm,
      type,
      ...results,
    });
  } catch (error) {
    console.error("Erreur API recherche:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur",
      },
      { status: 500 }
    );
  }
}

// Fonction de recherche de posts
async function searchPosts(searchTerm, limit, offset) {
  // Rechercher dans les posts directement
  const { count: postsCount, rows: directPosts } = await Post.findAndCountAll({
    where: {
      [Op.or]: [
        {
          text: {
            [Op.like]: `%${searchTerm}%`, // SQLite utilise LIKE
          },
        },
        {
          author: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      ],
    },
    order: [["time", "DESC"]],
    limit: Math.ceil(limit / 2),
    offset,
  });

  // Rechercher dans les commentaires et récupérer les posts correspondants
  const commentsWithPosts = await Comment.findAll({
    where: {
      [Op.and]: [
        {
          is_deleted: false,
        },
        {
          [Op.or]: [
            {
              text: {
                [Op.like]: `%${searchTerm}%`,
              },
            },
            {
              author: {
                [Op.like]: `%${searchTerm}%`,
              },
            },
          ],
        },
      ],
    },
    limit: Math.floor(limit / 2),
    order: [["time", "DESC"]],
  });

  // Récupérer les posts des commentaires trouvés
  const postIdsFromComments = [...new Set(commentsWithPosts.map(comment => comment.post_id))];
  const postsFromComments = postIdsFromComments.length > 0 ? await Post.findAll({
    where: {
      post_id: {
        [Op.in]: postIdsFromComments,
      },
    },
    order: [["time", "DESC"]],
  }) : [];

  // Combiner les résultats en évitant les doublons
  const allPostIds = new Set();
  const combinedPosts = [];
  
  // Ajouter les posts directs
  directPosts.forEach(post => {
    if (!allPostIds.has(post.post_id)) {
      allPostIds.add(post.post_id);
      combinedPosts.push(post);
    }
  });
  
  // Ajouter les posts des commentaires
  postsFromComments.forEach(post => {
    if (!allPostIds.has(post.post_id)) {
      allPostIds.add(post.post_id);
      combinedPosts.push(post);
    }
  });

  // Trier par date décroissante
  combinedPosts.sort((a, b) => new Date(b.time) - new Date(a.time));

  const totalCount = postsCount + postIdsFromComments.length;
  const finalPosts = combinedPosts.slice(0, limit);

  return {
    posts: finalPosts,
    total: totalCount,
    hasMore: offset + limit < totalCount,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(totalCount / limit),
  };
}

// Fonction de recherche d'utilisateurs
async function searchUsers(searchTerm, limit, offset) {
  const { count, rows } = await User.findAndCountAll({
    where: {
      [Op.or]: [
        {
          pseudo_user: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          description_user: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      ],
    },
    attributes: ["id_user", "pseudo_user", "description_user", "pfp_user"],
    order: [["pseudo_user", "ASC"]],
    limit,
    offset,
  });

  return {
    users: rows,
    total: count,
    hasMore: offset + limit < count,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(count / limit),
  };
}

// Fonction de recherche de commentaires
async function searchComments(searchTerm, limit, offset) {
  const { count, rows } = await Comment.findAndCountAll({
    where: {
      [Op.and]: [
        {
          is_deleted: false,
        },
        {
          [Op.or]: [
            {
              text: {
                [Op.like]: `%${searchTerm}%`,
              },
            },
            {
              author: {
                [Op.like]: `%${searchTerm}%`,
              },
            },
          ],
        },
      ],
    },
    order: [["time", "DESC"]],
    limit,
    offset,
  });

  return {
    comments: rows,
    total: count,
    hasMore: offset + limit < count,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(count / limit),
  };
}

// Fonction de recherche de hashtags (dans le texte des posts)
async function searchHashtags(searchTerm, limit, offset) {
  // Rechercher les posts contenant le hashtag
  const hashtagPattern = searchTerm.startsWith("#")
    ? searchTerm
    : `#${searchTerm}`;

  const { count, rows } = await Post.findAndCountAll({
    where: {
      text: {
        [Op.like]: `%${hashtagPattern}%`,
      },
    },
    order: [["time", "DESC"]],
    limit,
    offset,
  });

  return {
    posts: rows,
    hashtag: hashtagPattern,
    total: count,
    hasMore: offset + limit < count,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(count / limit),
  };
}

// Fonction de recherche globale
async function globalSearch(searchTerm, limit, offset) {
  const limitPerType = Math.ceil(limit / 3);
  const [postsResult, usersResult, commentsResult] = await Promise.all([
    searchPosts(searchTerm, limitPerType, 0),
    searchUsers(searchTerm, limitPerType, 0),
    searchComments(searchTerm, limitPerType, 0),
  ]);
  return {
    posts: postsResult.posts,
    users: usersResult.users,
    comments: commentsResult.comments,
    totalPosts: postsResult.total,
    totalUsers: usersResult.total,
    totalComments: commentsResult.total,
    total: postsResult.total + usersResult.total + commentsResult.total,
  };
}
