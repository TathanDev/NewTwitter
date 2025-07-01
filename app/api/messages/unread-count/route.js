import { NextResponse } from "next/server";
import { verifySession } from "@/utils/dal";
import { messageService } from "@/entities/Message";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const unreadCount = await messageService.getUnreadCount(session.userId);

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de messages non lus:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
