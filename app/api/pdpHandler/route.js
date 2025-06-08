import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("pdp");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "users_pfp");
  await fs.mkdir(uploadDir, { recursive: true });

  const fileName = Date.now() + "-" + file.name;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ url: "/users_pfp/" + fileName });
}

export async function DELETE(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 });
    }

    const fileName = url.split("/").pop();
    const filePath = path.join(process.cwd(), "public", "users_pfp", fileName);

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
