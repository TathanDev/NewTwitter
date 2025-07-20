import { NextResponse } from "next/server";
import { verifySession, getUser } from "@/utils/dal";
import { commentService } from "@/entities/Comment";
import { notificationService } from "@/entities/Notification";
import { postService } from "@/entities/Post";
import { emitNotification, getSocketIO } from "@/utils/socketUtils";
import User from "@/entities/User";

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

    // Créer des notifications selon le contexte
    try {
      // Si c'est une réponse à un commentaire
      if (parentCommentId) {
        // Récupérer le commentaire parent pour notifier son auteur
        const parentComment = await commentService.getCommentWithReplies(parentCommentId);
        if (parentComment && parentComment.author !== (currentUser.pseudo_user || currentUser.id_user)) {
          const parentAuthor = await User.findOne({ where: { pseudo_user: parentComment.author } });
          if (parentAuthor) {
            await notificationService.createReplyNotification(
              parentAuthor.id_user,
              currentUser.id_user,
              parentCommentId, // L'ID du commentaire parent comme related_id
              { post_id: postId } // Ajouter l'ID du post pour la navigation
            );
            
            // Émettre une notification temps réel via socket
            const io = getSocketIO();
            if (io) {
              await emitNotification(io, parentAuthor.id_user, 'reply', currentUser.id_user);
            }
          }
        }
      } else {
        // Sinon, c'est un commentaire sur le post, notifier l'auteur du post
        const post = await postService.getPostWithComments(postId);
        if (post && post.author !== (currentUser.pseudo_user || currentUser.id_user)) {
          // Récupérer l'ID de l'auteur du post
          const author = await User.findOne({ where: { pseudo_user: post.author } });
          if (author) {
            await notificationService.createCommentNotification(
              author.id_user,
              currentUser.id_user,
              postId
            );
            
            // Émettre une notification temps réel via socket
            const io = getSocketIO();
            if (io) {
              await emitNotification(io, author.id_user, 'comment', currentUser.id_user);
            }
          }
        }
      }
    } catch (notifError) {
      console.error('Erreur lors de la création de la notification de commentaire:', notifError);
      // Ne pas faire échouer la création du commentaire à cause d'une erreur de notification
    }

    // Traiter les mentions dans le texte du commentaire
    try {
      const mentionRegex = /@(\w+)/g;
      const mentions = [...text.matchAll(mentionRegex)];
      
      for (const mention of mentions) {
        const mentionedUsername = mention[1];
        if (mentionedUsername !== currentUser.pseudo_user) {
          const mentionedUser = await User.findOne({ where: { pseudo_user: mentionedUsername } });
          if (mentionedUser) {
            await notificationService.createMentionNotification(
              mentionedUser.id_user,
              currentUser.id_user,
              postId,
              'comment'
            );
            
            // Émettre une notification temps réel via socket
            const io = getSocketIO();
            if (io) {
              await emitNotification(io, mentionedUser.id_user, 'mention', currentUser.id_user);
            }
          }
        }
      }
    } catch (mentionError) {
      console.error('Erreur lors de la création des notifications de mention:', mentionError);
    }

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
