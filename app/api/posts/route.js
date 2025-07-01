import { postService } from "@/entities/Post";
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
