import { NextResponse } from "next/server";
import { verifySession } from "@/utils/dal";
import { messageService } from "@/entities/Message";

export async function DELETE(request, { params }) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { conversationId } = await params;
    
    // Delete all messages in the conversation
    const deletedCount = await messageService.deleteConversation(conversationId, session.userId);
    
    if (deletedCount === 0) {
      return NextResponse.json({ error: "Conversation non trouvée ou déjà supprimée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Conversation supprimée avec succès", deletedCount });
  } catch (error) {
    console.error("Erreur lors de la suppression de la conversation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
