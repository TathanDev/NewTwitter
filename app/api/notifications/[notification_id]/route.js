import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import { notificationService } from "@/entities/Notification";

// Marquer une notification spécifique comme lue
export async function PATCH(request, { params }) {
  try {
    const { notification_id } = await params;
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

    await notificationService.markAsRead(notification_id);

    return NextResponse.json({
      success: true,
      message: "Notification marquée comme lue",
    });
  } catch (error) {
    console.error("Erreur lors du marquage de la notification:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Supprimer une notification spécifique
export async function DELETE(request, { params }) {
  try {
    const { notification_id } = await params;
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

    await notificationService.deleteNotification(notification_id);

    return NextResponse.json({
      success: true,
      message: "Notification supprimée",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la notification:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
