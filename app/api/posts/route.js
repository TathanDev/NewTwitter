import Post, { postService } from "@/entities/Post";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await postService.getPostsWithLikesCount();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/posts - Création avec nouveau format
export async function POST(request) {
  const { author, content_structure, style_config, text, media } = await request.json();
  
  const post = await Post.create({
    author,
    content_structure: content_structure || null,
    style_config: style_config || {},
    text: text || "", // Fallback pour compatibilité
    media: media || "",
    content_version: content_structure ? 2 : 1,
    time: new Date().toISOString()
  });
  
  return NextResponse.json(post);
}
