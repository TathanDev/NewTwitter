import { NextResponse } from "next/server";
import { postController } from "../../../actions/postController";

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
