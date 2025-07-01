import { NextResponse } from "next/server";
import { verifySession } from "@/utils/dal";
import { messageService } from "@/entities/Message";
import User from "@/entities/User";

export async function GET(request, { params }) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { conversationId } = await params;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = parseInt(url.searchParams.get('offset')) || 0;

    const messages = await messageService.getConversationMessages(conversationId, limit, offset);
    
    // Enrichir les messages avec les informations des utilisateurs
    const userIds = [...new Set(messages.map(msg => [msg.sender_id, msg.receiver_id]).flat())];
    const users = await User.findAll({
      where: { id_user: userIds },
      attributes: ['id_user', 'pseudo_user', 'pfp_user']
    });
    
    const usersMap = {};
    users.forEach(user => {
      usersMap[user.id_user] = {
        id: user.id_user,
        pseudo: user.pseudo_user,
        pfp: user.pfp_user
      };
    });

    const enrichedMessages = messages.map(msg => ({
      ...msg.toJSON(),
      sender: usersMap[msg.sender_id],
      receiver: usersMap[msg.receiver_id]
    }));

    // Marquer les messages comme lus
    await messageService.markMessagesAsRead(conversationId, session.userId);

    return NextResponse.json({ messages: enrichedMessages });
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
