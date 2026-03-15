import { NextResponse } from "next/server";
import Follow from "@/entities/Follow";
import User from "@/entities/User";
import Post from "@/entities/Post";
import sequelize from "@/utils/sequelize";

// GET - Récupérer les statistiques d'un utilisateur
export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    await sequelize.sync();

    // Compter les abonnés, les abonnements et les posts
    const [followersCount, followingCount, postsCount] = await Promise.all([
      Follow.count({ where: { following_id: userId } }), // Nombre d'abonnés
      Follow.count({ where: { follower_id: userId } }),   // Nombre d'abonnements
      Post.count({ where: { author: userId } }),            // Nombre de posts
    ]);

    return NextResponse.json({
      success: true,
      data: {
        userId: parseInt(userId),
        followersCount,
        followingCount,
        postsCount,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
