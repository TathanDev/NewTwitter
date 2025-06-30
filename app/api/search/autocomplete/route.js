import { NextResponse } from "next/server";
import { Op } from "sequelize";
import Post from "@/entities/Post";
import User from "@/entities/User";
import Comment from "@/entities/Comment";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let query = searchParams.get("q");
    const type = searchParams.get("type") || "all";

    if (!query) {
      query = ""; // Permettre les queries vides pour montrer les suggestions par défaut
    }

    const searchTerm = query.trim();
    let suggestions = [];

    if (type === "users" || type === "all") {
      let whereClause;

      if (searchTerm === "") {
        // Si pas de terme de recherche, récupérer tous les utilisateurs
        whereClause = {};
      } else {
        // Sinon, chercher les utilisateurs correspondants
        whereClause = {
          [Op.or]: [
            {
              pseudo_user: {
                [Op.like]: `${searchTerm}%`,
              },
            },
            {
              pseudo_user: {
                [Op.like]: `%${searchTerm}%`,
              },
            },
          ],
        };
      }

      const users = await User.findAll({
        where: whereClause,
        attributes: ["id_user", "pseudo_user", "pfp_user"],
        limit: 8,
        order: [
          // Prioriser les correspondances exactes au début
          ["pseudo_user", "ASC"],
        ],
      });

      suggestions.push(
        ...users.map((user) => ({
          type: "user",
          id: user.id_user,
          pseudo_user: user.pseudo_user,
          pfp_user:
            user.pfp_user ||
            "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32",
          text: user.pseudo_user,
        }))
      );
    }

    if (type === "comments" || type === "all") {
      const comments = await Comment.findAll({
        where: {
          is_deleted: false,
          text: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        attributes: ["comment_id", "text"],
        limit: 5,
        order: [["time", "DESC"]],
      });

      suggestions.push(
        ...comments.map((comment) => ({
          type: "comment",
          id: comment.comment_id,
          label: comment.text,
          value: comment.text,
        }))
      );
    }

    if (type === "hashtags" || type === "all") {
      // Extraction des hashtags depuis les posts avec comptage
      let whereClauseHashtags;

      if (searchTerm === "") {
        // Si pas de terme de recherche, récupérer tous les posts avec hashtags
        whereClauseHashtags = {
          text: {
            [Op.like]: `%#%`,
          },
        };
      } else {
        // Sinon, chercher les posts avec hashtags correspondants
        whereClauseHashtags = {
          text: {
            [Op.like]: `%#${searchTerm}%`,
          },
        };
      }

      const posts = await Post.findAll({
        where: whereClauseHashtags,
        attributes: ["text"],
        limit: 50,
        order: [["post_id", "DESC"]],
      });

      const hashtagCounts = {};
      const hashtagRegex = /#(\w+)/g;

      posts.forEach((post) => {
        const matches = post.text.match(hashtagRegex);
        if (matches) {
          matches.forEach((match) => {
            const hashtag = match.slice(1).toLowerCase(); // Enlever le # et mettre en minuscules
            // Si pas de terme de recherche ou si le hashtag contient le terme
            if (
              searchTerm === "" ||
              hashtag.includes(searchTerm.toLowerCase())
            ) {
              hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
            }
          });
        }
      });

      // Convertir en array et trier par popularité
      const hashtagSuggestions = Object.entries(hashtagCounts)
        .map(([hashtag, count]) => ({
          type: "hashtag",
          text: hashtag,
          hashtag: hashtag,
          count: count,
        }))
        .sort((a, b) => {
          // Prioriser les hashtags qui commencent par la requête
          const aStartsWith = a.hashtag.startsWith(searchTerm.toLowerCase());
          const bStartsWith = b.hashtag.startsWith(searchTerm.toLowerCase());

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          // Ensuite trier par popularité
          return b.count - a.count;
        })
        .slice(0, 8);

      suggestions.push(...hashtagSuggestions);
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 8) });
  } catch (error) {
    console.error("Erreur autocomplétion:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
