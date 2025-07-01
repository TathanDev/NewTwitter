import { NextResponse } from "next/server";
import { verifySession } from "@/utils/dal";
import { messageService } from "@/entities/Message";

export async function POST(request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { receiverId, content, messageType = "text", mediaUrl = null, replyTo = null } = await request.json();

    if (!receiverId || !content || content.trim() === "") {
      return NextResponse.json(
        { error: "Destinataire et contenu requis" },
        { status: 400 }
      );
    }

    const message = await messageService.sendMessage(
      session.userId,
      receiverId,
      content.trim(),
      messageType,
      mediaUrl,
      replyTo
    );

    return NextResponse.json({ 
      success: true, 
      message: {
        ...message.toJSON(),
        sender: {
          id: session.userId,
          pseudo: session.pseudo,
          pfp: session.pfp
        }
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
