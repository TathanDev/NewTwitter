import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import Post from "@/entities/Post";
import Comment from "@/entities/Comment";

export async function DELETE(request, { params }) {
  try {
    const { post_id } = await params;
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

    // Vérifier que l'utilisateur fourni dans la requête correspond à l'utilisateur connecté
    if (currentUser.id_user !== userId) {
      return NextResponse.json(
        { error: "ID utilisateur non valide" },
        { status: 403 }
      );
    }

    // Récupérer le post à supprimer
    const post = await Post.findByPk(post_id);
    if (!post) {
      return NextResponse.json(
        { error: "Post non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur connecté est bien l'auteur du post
    // On compare avec l'auteur stocké dans le post (qui est le pseudo/id_user)
    if (post.author !== currentUser.pseudo_user && post.author !== currentUser.id_user) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer ce post" },
        { status: 403 }
      );
    }

    // Supprimer d'abord tous les commentaires liés au post
    await Comment.destroy({
      where: { post_id: post_id },
    });

    // Puis supprimer le post
    await Post.destroy({
      where: { post_id: post_id },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Post supprimé avec succès",
        post_id: post_id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression du post" },
      { status: 500 }
    );
  }
}
