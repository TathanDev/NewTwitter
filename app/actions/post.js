"use server";

import Post from "@/entities/Post";
import { redirect } from "next/navigation";

export async function createPost(data) {
  try {
    console.log("FormData:", data);
    const post = await Post.create({
      author: data.pseudo,
      text: data.text,
      media: data.media,
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur lors de la publication d'un post", error);
  } finally {
    redirect("/");
  }
}
export async function deletePost(postId, userId) {
  try {
    // Importer les utilitaires de vérification d'authentification
    const { verifySession, getUser } = await import("@/utils/dal");
    
    // Vérifier que l'utilisateur est connecté
    const session = await verifySession();
    if (!session) {
      throw new Error("Authentification requise");
    }

    // Récupérer l'utilisateur connecté
    const currentUser = await getUser();
    if (!currentUser) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérifier que l'utilisateur fourni correspond à l'utilisateur connecté
    if (currentUser.id_user !== userId) {
      throw new Error("Utilisateur non autorisé");
    }

    // Récupérer le post à supprimer
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new Error("Post non trouvé");
    }

    // Vérifier que l'utilisateur connecté est bien l'auteur du post
    if (post.author !== currentUser.pseudo_user && post.author !== currentUser.id_user) {
      throw new Error("Vous n'êtes pas autorisé à supprimer ce post");
    }

    // Supprimer le post
    await Post.destroy({
      where: { post_id: postId },
    });
    
    console.log(`Post ${postId} supprimé par l'utilisateur ${currentUser.id_user}`);
  } catch (error) {
    console.error("Erreur lors de la suppression du post", error);
    throw error; // Re-throw pour permettre à l'appelant de gérer l'erreur
  } finally {
    redirect("/");
  }
}
