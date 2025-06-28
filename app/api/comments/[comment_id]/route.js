import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import { commentService } from "@/entities/Comment";

// Like/Unlike un commentaire
export async function POST(request, { params }) {
  try {
    const { comment_id } = await params;
    const { action, userId } = await request.json();

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

    // Vérifier que l'utilisateur fourni correspond à l'utilisateur connecté
    if (currentUser.id_user !== userId) {
      return NextResponse.json(
        { error: "ID utilisateur non valide" },
        { status: 403 }
      );
    }

    let result;
    if (action === 'like') {
      result = await commentService.addLike(comment_id, userId);
    } else if (action === 'unlike') {
      result = await commentService.removeLike(comment_id, userId);
    } else {
      return NextResponse.json(
        { error: "Action non valide. Utilisez 'like' ou 'unlike'" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      likesCount: result.likes.length,
      hasLiked: action === 'like'
    });

  } catch (error) {
    console.error("Erreur lors de l'action sur le commentaire:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 400 }
    );
  }
}

// Supprimer un commentaire
export async function DELETE(request, { params }) {
  try {
    const { comment_id } = await params;
    const { userId } = await request.json();

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

    // Vérifier que l'utilisateur fourni correspond à l'utilisateur connecté
    if (currentUser.id_user !== userId) {
      return NextResponse.json(
        { error: "ID utilisateur non valide" },
        { status: 403 }
      );
    }

    // Supprimer le commentaire (soft delete)
    const authorIdentifier = currentUser.pseudo_user || currentUser.id_user;
    await commentService.deleteComment(comment_id, authorIdentifier);

    return NextResponse.json({
      success: true,
      message: "Commentaire supprimé avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur lors de la suppression du commentaire" },
      { status: 400 }
    );
  }
}

// Récupérer un commentaire spécifique avec ses réponses
export async function GET(request, { params }) {
  try {
    const { comment_id } = await params;

    const comment = await commentService.getCommentWithReplies(comment_id);
    
    if (!comment) {
      return NextResponse.json(
        { error: "Commentaire non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      comment: comment
    });

  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération du commentaire" },
      { status: 500 }
    );
  }
}
