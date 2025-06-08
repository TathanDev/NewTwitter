"use server";

import User from "@/entities/User";
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
export async function deletePost(postId) {
  try {
    await Post.destroy({
      where: { post_id: postId },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du post", error);
  } finally {
    redirect("/");
  }
}
