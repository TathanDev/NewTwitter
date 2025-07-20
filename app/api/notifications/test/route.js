import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import { notificationService } from "@/entities/Notification";

// Route temporaire pour créer des notifications de test
export async function POST(request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const currentUser = await getUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Créer quelques notifications de test
    const testNotifications = [
      {
        type: 'like',
        title: 'Nouveau like',
        content: 'Quelqu\'un a liké votre post.',
        relatedId: 1,
        relatedType: 'post'
      },
      {
        type: 'comment',
        title: 'Nouveau commentaire',
        content: 'Quelqu\'un a commenté votre post.',
        relatedId: 1,
        relatedType: 'post'
      },
      {
        type: 'follow',
        title: 'Nouvel abonné',
        content: 'Quelqu\'un s\'est abonné à vous.',
        relatedId: currentUser.id_user,
        relatedType: 'user'
      }
    ];

    const createdNotifications = [];
    
    for (const notif of testNotifications) {
      const notification = await notificationService.createNotification({
        recipientId: currentUser.id_user,
        senderId: currentUser.id_user + 1, // Utilisateur fictif
        type: notif.type,
        title: notif.title,
        content: notif.content,
        relatedId: notif.relatedId,
        relatedType: notif.relatedType
      });
      
      if (notification) {
        createdNotifications.push(notification);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdNotifications.length} notifications de test créées`,
      notifications: createdNotifications
    });

  } catch (error) {
    console.error("Erreur lors de la création des notifications de test:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
