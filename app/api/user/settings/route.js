import { NextResponse } from "next/server";
import { verifySession } from "@/utils/dal";
import User from "@/entities/User";

// GET - Récupérer les paramètres de l'utilisateur
export async function GET(request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({
      settings: {
        allow_new_conversations: user.allow_new_conversations,
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les paramètres de l'utilisateur
export async function PUT(request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { allow_new_conversations } = await request.json();

    // Validation des valeurs autorisées
    const allowedValues = ['everyone', 'followers', 'none'];
    if (allow_new_conversations && !allowedValues.includes(allow_new_conversations)) {
      return NextResponse.json(
        { error: "Valeur invalide pour allow_new_conversations" },
        { status: 400 }
      );
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Mettre à jour les paramètres
    const updateData = {};
    if (allow_new_conversations !== undefined) {
      updateData.allow_new_conversations = allow_new_conversations;
    }

    await user.update(updateData);

    return NextResponse.json({
      success: true,
      settings: {
        allow_new_conversations: user.allow_new_conversations,
      }
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
