import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import { notificationService } from "@/entities/Notification";
import User from "@/entities/User";

// Récupérer les notifications de l'utilisateur connecté
export async function GET(request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    const currentUser = await getUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les notifications avec les informations de l'expéditeur
    const notifications = await notificationService.getNotificationsByUser(currentUser.id_user);
    
    // Enrichir les notifications avec les données des utilisateurs expéditeurs
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const notifData = notification.toJSON();
        
        if (notifData.sender_id) {
          try {
            const sender = await User.findByPk(notifData.sender_id);
            notifData.sender = sender ? {
              id_user: sender.id_user,
              pseudo_user: sender.pseudo_user,
              pfp_user: sender.pfp_user,
            } : null;
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur ${notifData.sender_id}:`, error);
            notifData.sender = null;
          }
        }
        
        return notifData;
      })
    );

    return NextResponse.json({
      success: true,
      notifications: enrichedNotifications,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Marquer toutes les notifications comme lues
export async function PATCH(request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    const currentUser = await getUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    await notificationService.markAllAsRead(currentUser.id_user);

    return NextResponse.json({
      success: true,
      message: "Toutes les notifications ont été marquées comme lues",
    });
  } catch (error) {
    console.error("Erreur lors du marquage des notifications:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
