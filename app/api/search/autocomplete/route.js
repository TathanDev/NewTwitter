import { NextResponse } from "next/server";
import { Op } from "sequelize";
import Post from "@/entities/Post";
import User from "@/entities/User";
import Comment from "@/entities/Comment";
import { extractHashtagsFromContentStructure } from "../../../utils/searchUtils.js";

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
        whereClause = {};
      } else {
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
          value: user.pseudo_user,
        }))
      );
    }
    /*
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
          text: comment.text,
          value: comment.text,
        }))
      );
    }*/

    if (type === "hashtags" || type === "all") {
      let whereClauseHashtags;

      if (searchTerm === "") {
        whereClauseHashtags = {
          [Op.or]: [
            {
              text: {
                [Op.like]: `%#%`,
              },
            },
            {
              content_structure: {
                [Op.like]: `%#%`,
              },
            },
          ],
        };
      } else {
        whereClauseHashtags = {
          [Op.or]: [
            {
              text: {
                [Op.like]: `%#${searchTerm}%`,
              },
            },
            {
              content_structure: {
                [Op.like]: `%#${searchTerm}%`,
              },
            },
          ],
        };
      }

      const posts = await Post.findAll({
        attributes: ["text", "content_structure"],
        limit: 100,
        order: [["post_id", "DESC"]],
      });


      const hashtagCounts = {};
      const hashtagRegex = /#(\w+)/g;

      posts.forEach((post) => {
        let foundHashtags = [];

        if (post.text) {
          const matches = post.text.match(hashtagRegex);
          if (matches) {
            matches.forEach((match) => {
              const hashtag = match.slice(1).toLowerCase();
              foundHashtags.push(hashtag);
            });
          }
        }
        
        if (post.content_structure) {
          try {
            let contentStructure = post.content_structure;
            if (typeof contentStructure === 'string') {
              contentStructure = JSON.parse(contentStructure);
            }
            
            if (contentStructure && contentStructure.components) {
              contentStructure.components.forEach(component => {
                if (component.type === 'text' && component.data && component.data.content) {
                  const componentMatches = component.data.content.match(hashtagRegex);
                  if (componentMatches) {
                    componentMatches.forEach((match) => {
                      const hashtag = match.slice(1).toLowerCase();
                      foundHashtags.push(hashtag);
                    });
                  }
                }
              });
            }
          } catch (e) {
            console.log('Erreur extraction hashtags content_structure:', e, post.content_structure);
          }
        }
        
        foundHashtags.forEach(hashtag => {
          if (
            searchTerm === "" ||
            hashtag.includes(searchTerm.toLowerCase())
          ) {
            hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
          }
        });
      });

      if (Object.keys(hashtagCounts).length === 0 && searchTerm === "") {
        const defaultHashtags = ['javascript', 'react', 'nextjs', 'web', 'dev', 'coding', 'tech', 'programming'];
        defaultHashtags.forEach(tag => {
          hashtagCounts[tag] = 1;
        });
      }

      const hashtagSuggestions = Object.entries(hashtagCounts)
        .map(([hashtag, count]) => ({
          type: "hashtag",
          text: hashtag,
          hashtag: hashtag,
          value: hashtag, 
          count: count,
        }))
        .sort((a, b) => {
          const aStartsWith = a.hashtag.startsWith(searchTerm.toLowerCase());
          const bStartsWith = b.hashtag.startsWith(searchTerm.toLowerCase());

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

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
