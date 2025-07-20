import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import { notificationService } from "@/entities/Notification";

// Récupérer uniquement le nombre de notifications non lues
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

    // Récupérer directement le compte depuis la base de données
    const unreadCount = await notificationService.getUnreadCount(currentUser.id_user);

    return NextResponse.json({
      success: true,
      unreadCount: unreadCount,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de notifications:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
