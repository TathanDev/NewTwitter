import { NextResponse } from "next/server";
import { postController } from "../../../actions/postController";
import { postService } from "@/entities/Post";
import { verifySession, getUser } from "@/utils/dal";
import { notificationService } from "@/entities/Notification";
import { emitNotification, getSocketIO } from "@/utils/socketUtils";
import User from "@/entities/User";

export async function GET(request, { params }) {
  try {
    const { post_id } = await params;
    
    // Récupérer le post directement depuis la base de données
    const post = await postService.getPostWithComments(post_id);
    
    if (!post) {
      return NextResponse.json({ error: "Post non trouvé" }, { status: 404 });
    }
    
    return NextResponse.json(post);
    
  } catch (error) {
    console.error("Erreur lors de la récupération du post:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { post_id } = await params;
    const { userId } = await request.json();
    
    // Vérifier l'authentification
    const session = await verifySession();
    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer le post pour connaître l'auteur
    const post = await postService.getPostWithComments(post_id);
    if (!post) {
      return NextResponse.json({ error: "Post non trouvé" }, { status: 404 });
    }

    const result = await postController.likePost(post_id, userId);
    
    // Créer une notification de like si l'auteur du post n'est pas celui qui like
    if (post.author !== userId) {
      try {
        // Récupérer l'ID de l'auteur du post
        const author = await User.findOne({ where: { pseudo_user: post.author } });
        if (author) {
          await notificationService.createLikeNotification(
            author.id_user,
            userId,
            post_id,
            'post'
          );
          
          // Émettre une notification temps réel via socket
          const io = getSocketIO();
          if (io) {
            await emitNotification(io, author.id_user, 'like', userId);
          }
        }
      } catch (notifError) {
        console.error('Erreur lors de la création de la notification:', notifError);
        // Ne pas faire échouer le like à cause d'une erreur de notification
      }
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { post_id } = await params;
    const { userId } = await request.json();
    
    // Vérifier l'authentification
    const session = await verifySession();
    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    
    const result = await postController.unlikePost(post_id, userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
