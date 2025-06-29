import { NextResponse } from "next/server";
import { postService } from "@/entities/Post";

export async function GET() {
  try {
    const posts = await postService.getPostsWithLikesCount();
    
    // Limiter aux 10 posts les plus récents
    const limitedPosts = posts.slice(0, 10);
    
    return NextResponse.json(limitedPosts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des posts" },
      { status: 500 }
    );
  }
}
