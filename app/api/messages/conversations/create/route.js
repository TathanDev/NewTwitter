import { NextResponse } from "next/server";
import { verifySession } from "@/utils/dal";
import { messageService } from "@/entities/Message";
import User from "@/entities/User";

export async function POST(request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { participantId } = await request.json();

    if (!participantId) {
      return NextResponse.json(
        { error: "ID du participant requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur ne tente pas de créer une conversation avec lui-même
    if (session.userId === participantId) {
      return NextResponse.json(
        { error: "Impossible de créer une conversation avec soi-même" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur destinataire existe
    const participant = await User.findByPk(participantId);
    if (!participant) {
      return NextResponse.json(
        { error: "Utilisateur destinataire non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier les permissions de conversation
    const conversationSetting = participant.allow_new_conversations;
    
    if (conversationSetting === 'none') {
      return NextResponse.json(
        { error: "Cet utilisateur n'accepte pas de nouvelles conversations" },
        { status: 403 }
      );
    }
    
    if (conversationSetting === 'followers') {
      // Vérifier si l'utilisateur actuel suit le destinataire
      // Pour cela, nous devons importer et utiliser l'entité Follow
      try {
        const { Follow } = await import('@/entities/Follow');
        const isFollowing = await Follow.findOne({
          where: {
            follower_id: session.userId,
            followed_id: participantId
          }
        });
        
        if (!isFollowing) {
          return NextResponse.json(
            { error: "Vous devez suivre cet utilisateur pour lui envoyer un message" },
            { status: 403 }
          );
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du suivi:", error);
        // En cas d'erreur, on continue (fallback gracieux)
      }
    }

    // Générer l'ID de conversation
    const conversationId = messageService.generateConversationId(session.userId, participantId);

    // Récupérer les informations du participant pour la réponse
    const participantInfo = {
      id: participant.id_user,
      pseudo: participant.pseudo_user,
      pfp: participant.pfp_user,
    };

    return NextResponse.json({ 
      success: true,
      conversation: {
        conversation_id: conversationId,
        partner: participantInfo,
        last_message: null,
        unread_count: 0,
      }
    });
  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
