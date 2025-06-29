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

    if (!query || query.trim().length < 1) {
      return NextResponse.json({ suggestions: [] });
    }

    const searchTerm = query.trim();
    let suggestions = [];

    if (type === "users" || type === "all") {
      const users = await User.findAll({
        where: {
          pseudo_user: {
            [Op.like]: `${searchTerm}%`,
          },
        },
        attributes: ["id_user", "pseudo_user", "pfp_user"],
        limit: 5,
        order: [["pseudo_user", "ASC"]],
      });

      suggestions.push(
        ...users.map((user) => ({
          type: "user",
          id: user.id_user,
          label: user.pseudo_user,
          avatar: user.pfp_user,
          value: user.pseudo_user,
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
      // Extraction simple des hashtags depuis les posts
      const posts = await Post.findAll({
        where: {
          text: {
            [Op.like]: `%#${searchTerm}%`,
          },
        },
        attributes: ["text"],
        limit: 10,
      });

      const hashtags = new Set();
      posts.forEach((post) => {
        const matches = post.text.match(/#\w+/g);
        if (matches) {
          matches.forEach((tag) => {
            if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
              hashtags.add(tag);
            }
          });
        }
      });

      Array.from(hashtags)
        .slice(0, 3)
        .forEach((tag) => {
          suggestions.push({
            type: "hashtag",
            label: tag,
            value: tag,
          });
        });
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 8) });
  } catch (error) {
    console.error("Erreur autocomplétion:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
