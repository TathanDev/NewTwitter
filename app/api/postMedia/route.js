import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  // Récupère le nom du fichier depuis les headers (à envoyer côté client)
  const fileName = request.headers.get("x-filename");
  if (!fileName) {
    return NextResponse.json(
      { error: "Nom de fichier manquant" },
      { status: 400 }
    );
  }

  const bytes = await request.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "posts_media");
  await fs.mkdir(uploadDir, { recursive: true });

  const uniqueName = Date.now() + "-" + fileName;
  const filePath = path.join(uploadDir, uniqueName);

  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ url: "/posts_media/" + uniqueName });
}

export async function DELETE(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 });
    }

    const fileName = url.split("/").pop();
    const filePath = path.join(
      process.cwd(),
      "public",
      "posts_media",
      fileName
    );

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return NextResponse.json({ message: "Fichier supprimé avec succès" });
    } catch (fileError) {
      return NextResponse.json(
        { error: "Fichier non trouvé" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du fichier" },
      { status: 500 }
    );
  }
}
