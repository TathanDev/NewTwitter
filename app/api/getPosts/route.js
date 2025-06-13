import { NextResponse } from "next/server";
import Post from "@/entities/Post";

export async function GET() {
  const posts = await Post.findAll({
    limit: 10,
    order: [["time", "DESC"]],
  });
  return NextResponse.json(posts);
}
