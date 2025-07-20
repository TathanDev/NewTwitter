import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import Follow from "@/entities/Follow";
import User from "@/entities/User";
import sequelize from "@/utils/sequelize";
import { notificationService } from "@/entities/Notification";
import { emitNotification, getSocketIO } from "@/utils/socketUtils";

// POST - Follow/Unfollow un utilisateur
export async function POST(request) {
  try {
    const session = await verifySession();
    const user = await getUser();
    
    if (!session || !user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { targetUserId, action } = await request.json();
    
    if (!targetUserId || !action || (action !== "follow" && action !== "unfollow")) {
      return NextResponse.json(
        { error: "Paramètres invalides" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur ne peut pas se suivre lui-même
    if (parseInt(targetUserId) === user.id_user) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas vous suivre vous-même" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur cible existe
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    await sequelize.sync();

    if (action === "follow") {
      // Créer une relation de suivi
      const [followRelation, created] = await Follow.findOrCreate({
        where: {
          follower_id: user.id_user,
          following_id: targetUserId,
        },
        defaults: {
          follower_id: user.id_user,
          following_id: targetUserId,
        },
      });

      if (!created) {
        return NextResponse.json(
          { error: "Vous suivez déjà cet utilisateur" },
          { status: 400 }
        );
      }

      // Créer une notification de suivi
      try {
        await notificationService.createFollowNotification(
          targetUserId,
          user.id_user
        );

        // Émettre une notification temps réel
        const io = getSocketIO();
        if (io) {
          await emitNotification(io, targetUserId, 'follow', user.id_user);
        }
      } catch (notifError) {
        console.error('Erreur lors de la création de la notification de suivi:', notifError);
        // Ne pas faire échouer l'action de follow pour un problème de notification
      }

      return NextResponse.json({
        success: true,
        message: "Utilisateur suivi avec succès",
        isFollowing: true,
      });
    } else {
      // Supprimer la relation de suivi
      const deletedRows = await Follow.destroy({
        where: {
          follower_id: user.id_user,
          following_id: targetUserId,
        },
      });

      if (deletedRows === 0) {
        return NextResponse.json(
          { error: "Vous ne suivez pas cet utilisateur" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Utilisateur non suivi",
        isFollowing: false,
      });
    }
  } catch (error) {
    console.error("Erreur lors du follow/unfollow:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// GET - Vérifier si l'utilisateur connecté suit un utilisateur donné
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
    const targetUserId = searchParams.get("targetUserId");

    if (!targetUserId) {
      return NextResponse.json(
        { error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    await sequelize.sync();

    const followRelation = await Follow.findOne({
      where: {
        follower_id: user.id_user,
        following_id: targetUserId,
      },
    });

    return NextResponse.json({
      isFollowing: !!followRelation,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du follow:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
