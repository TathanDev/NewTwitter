import { NextResponse } from "next/server";
import { verifySession } from "@/utils/dal";
import { messageService } from "@/entities/Message";
import User from "@/entities/User";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const conversations = await messageService.getUserConversations(session.userId);
    
    // Enrichir les conversations avec les informations des utilisateurs
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const partner = await User.findByPk(conv.partner_id, {
          attributes: ['id_user', 'pseudo_user', 'pfp_user']
        });
        
        return {
          ...conv,
          partner: partner ? {
            id: partner.id_user,
            pseudo: partner.pseudo_user,
            pfp: partner.pfp_user
          } : null
        };
      })
    );

    return NextResponse.json({ conversations: enrichedConversations });
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
