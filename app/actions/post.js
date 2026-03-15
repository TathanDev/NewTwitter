"use server";

import { z } from "zod";
import Post from "@/entities/Post";
import { verifySession, getUser } from "@/utils/dal";

// Sanitization: strip HTML tags to prevent XSS
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "");
}

// Zod schema for post validation
const postSchema = z.object({
  text: z
    .string()
    .max(500, "Le post ne peut pas dépasser 500 caractères")
    .refine((val) => val.trim().length > 0, "Le post ne peut pas être vide"),
  content_type: z.string().optional(),
  author: z.string().optional(),
  media: z.string().optional(),
  content_structure: z.any().optional(),
  style_config: z.any().optional(),
});

export async function createPost(data) {
  // Validate with Zod
  const validation = postSchema.safeParse(data);
  if (!validation.success) {
    const errorMessages = validation.error.issues.map((issue) => issue.message).join(", ");
    throw new Error(errorMessages);
  }

  const validatedData = validation.data;

  // Sanitize text input
  const sanitizedText = sanitizeInput(validatedData.text);
  const sanitizedAuthor = validatedData.author ? sanitizeInput(validatedData.author) : "";

  try {
    console.log("FormData reçue:", data);

    // Récupérer l'utilisateur pour obtenir son ID
    const session = await verifySession();
    const currentUser = await getUser();

    // Support des anciens et nouveaux formats
    const postData = {
      author: sanitizedAuthor || data.pseudo, // Support des deux formats
      author_id: currentUser?.id_user || null, // Stocker l'ID utilisateur
      text: sanitizedText || "",
      media: data.media || "",
      time: new Date().toISOString(),
    };

    // Ajouter les nouveaux champs si présents
    if (data.content_structure) {
      postData.content_structure = data.content_structure;
      postData.content_version = 2;
      console.log("Structure de contenu ajoutée:", JSON.stringify(postData.content_structure, null, 2));
    } else {
      postData.content_version = 1;
    }

    if (data.style_config) {
      postData.style_config = data.style_config;
      console.log("Configuration de style ajoutée:", JSON.stringify(postData.style_config, null, 2));
    }

    console.log("Données finales envoyées à la base:", JSON.stringify(postData, null, 2));

    const post = await Post.create(postData);
    console.log("Post créé avec succès:", post.post_id);

    // Retourner un indicateur de succès au lieu de rediriger
    return { success: true, postId: post.post_id };
  } catch (error) {
    console.error("Erreur lors de la publication d'un post:", error);
    console.error("Stack trace:", error.stack);
    // Relancer l'erreur pour que le client puisse la gérer
    throw error;
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
  }
}