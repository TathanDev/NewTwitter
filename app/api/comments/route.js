import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import { commentService } from "@/entities/Comment";

export async function POST(request) {
  try {
    const { postId, parentCommentId, text } = await request.json();

    // Vérifier que l'utilisateur est connecté
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur connecté
    const currentUser = await getUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Validation des données
    if (!postId || !text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Post ID et texte sont requis" },
        { status: 400 }
      );
    }

    if (text.trim().length > 500) {
      return NextResponse.json(
        { error: "Le commentaire ne peut pas dépasser 500 caractères" },
        { status: 400 }
      );
    }

    // Créer le commentaire
    const comment = await commentService.createComment(
      postId,
      parentCommentId || null,
      currentUser.pseudo_user || currentUser.id_user,
      text.trim()
    );

    return NextResponse.json(
      {
        success: true,
        comment: comment,
        message: "Commentaire créé avec succès"
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du commentaire" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID requis" },
        { status: 400 }
      );
    }

    const comments = await commentService.getCommentsByPostId(postId);

    return NextResponse.json({
      success: true,
      comments: comments
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des commentaires" },
      { status: 500 }
    );
  }
}
