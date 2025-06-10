import { NextResponse } from "next/server";
import { Op } from "sequelize";
import Post from "@/entities/Post";
import User from "@/entities/User";

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
  const { count, rows } = await Post.findAndCountAll({
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
    limit,
    offset,
  });

  return {
    posts: rows,
    total: count,
    hasMore: offset + limit < count,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(count / limit),
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
  const [postsResult, usersResult] = await Promise.all([
    searchPosts(searchTerm, Math.ceil(limit / 2), 0),
    searchUsers(searchTerm, Math.ceil(limit / 2), 0),
  ]);
  return {
    posts: postsResult.posts,
    users: usersResult.users,
    totalPosts: postsResult.total,
    totalUsers: usersResult.total,
    total: postsResult.total + usersResult.total,
  };
}
