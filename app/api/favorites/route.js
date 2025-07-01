import User from "@/entities/User";
import { postService } from "@/entities/Post";
import { NextResponse } from "next/server";
import { verifySession } from "@/utils/dal";

// Ajouter ou retirer un post des favoris
export async function POST(request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { postId, action } = await request.json();
    
    if (!postId) {
      return NextResponse.json({ error: "ID du post requis" }, { status: 400 });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Récupérer la liste actuelle des favoris
    let favorites = Array.isArray(user.favorite_posts) ? user.favorite_posts : [];
    
    // Convertir postId en string pour cohérence
    const postIdStr = String(postId);
    
    if (action === "add") {
      // Ajouter aux favoris si pas déjà présent
      if (!favorites.includes(postIdStr)) {
        favorites.push(postIdStr);
      }
    } else if (action === "remove") {
      // Retirer des favoris
      favorites = favorites.filter(id => String(id) !== postIdStr);
    } else {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    // Mettre à jour la base de données
    await user.update({ favorite_posts: favorites });

    return NextResponse.json({ 
      success: true, 
      isFavorite: action === "add",
      favoritesCount: favorites.length 
    });

  } catch (error) {
    console.error("Erreur lors de la gestion des favoris:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Récupérer les posts favoris d'un utilisateur
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

    const favorites = Array.isArray(user.favorite_posts) ? user.favorite_posts : [];
    
    if (favorites.length === 0) {
      return NextResponse.json([]);
    }

    // Récupérer tous les posts
    const allPosts = await postService.getPostsWithLikesCount();
    
    // Filtrer pour ne garder que les posts favoris
    const favoritePosts = allPosts.filter(post => 
      favorites.includes(String(post.post_id))
    );

    // Trier par ordre inverse des favoris (plus récemment ajouté en premier)
    const sortedFavorites = favoritePosts.sort((a, b) => {
      const aIndex = favorites.indexOf(String(a.post_id));
      const bIndex = favorites.indexOf(String(b.post_id));
      return bIndex - aIndex;
    });

    return NextResponse.json(sortedFavorites);

  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
