import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import Follow from "@/entities/Follow";
import User from "@/entities/User";
import sequelize from "@/utils/sequelize";

// GET - Récupérer la liste des abonnés ou des abonnements d'un utilisateur
export async function GET(request) {
  try {
    const session = await verifySession();
    const user = await getUser();
    
    if (!session || !user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "followers" ou "following"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    if (!userId || !type) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    if (type !== "followers" && type !== "following") {
      return NextResponse.json(
        { error: "Type invalide. Utilisez 'followers' ou 'following'" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur peut voir cette liste (seul le propriétaire peut voir ses listes)
    if (parseInt(userId) !== user.id_user) {
      return NextResponse.json(
        { error: "Vous ne pouvez voir que vos propres abonnés/abonnements" },
        { status: 403 }
      );
    }

    await sequelize.sync();

    let followQuery, countQuery;

    if (type === "followers") {
      // Récupérer les abonnés (ceux qui suivent cet utilisateur)
      followQuery = {
        where: { following_id: userId },
        include: [
          {
            model: User,
            as: "Follower",
            attributes: ["id_user", "pseudo_user", "pfp_user", "description_user"],
            foreignKey: "follower_id",
          }
        ],
        limit,
        offset,
        order: [["created_at", "DESC"]],
      };
      
      countQuery = { where: { following_id: userId } };
    } else {
      // Récupérer les abonnements (ceux que cet utilisateur suit)
      followQuery = {
        where: { follower_id: userId },
        include: [
          {
            model: User,
            as: "Following",
            attributes: ["id_user", "pseudo_user", "pfp_user", "description_user"],
            foreignKey: "following_id",
          }
        ],
        limit,
        offset,
        order: [["created_at", "DESC"]],
      };
      
      countQuery = { where: { follower_id: userId } };
    }

    // Définir les associations si elles n'existent pas déjà
    if (!Follow.associations.Follower) {
      Follow.belongsTo(User, { 
        as: "Follower", 
        foreignKey: "follower_id",
        targetKey: "id_user"
      });
    }
    
    if (!Follow.associations.Following) {
      Follow.belongsTo(User, { 
        as: "Following", 
        foreignKey: "following_id",
        targetKey: "id_user"
      });
    }

    const [follows, totalCount] = await Promise.all([
      Follow.findAll(followQuery),
      Follow.count(countQuery),
    ]);

    // Formater les données de réponse
    const users = follows.map(follow => {
      const user = type === "followers" ? follow.Follower : follow.Following;
      return {
        id_user: user.id_user,
        pseudo_user: user.pseudo_user,
        pfp_user: user.pfp_user,
        description_user: user.description_user,
        followed_at: follow.created_at,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
