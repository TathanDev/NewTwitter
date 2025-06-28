import { postController } from "@/entities/Post";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return postController.getPosts(req, res);
  }
  res.status(405).json({ error: "Méthode non autorisée" });
}
