import { NextResponse } from "next/server";
import { postController } from "../../../actions/postController";

export async function GET(request, { params }) {
  try {
    const { post_id } = await params;
    
    // Récupérer tous les posts depuis votre source de données
    const postsResponse = await fetch("http://localhost:3000/api/getPosts", {
      cache: 'no-store'
    });
    
    if (!postsResponse.ok) {
      return NextResponse.json({ error: "Erreur lors de la récupération des posts" }, { status: 500 });
    }
    
    const allPosts = await postsResponse.json();
    
    // Trouver le post spécifique par son ID
    const post = allPosts.find(p => p.post_id == post_id);
    
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
    const result = await postController.likePost(post_id, userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { post_id } = await params;
    const { userId } = await request.json();
    const result = await postController.unlikePost(post_id, userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
