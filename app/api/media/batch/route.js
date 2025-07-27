import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const uploadedFiles = [];

    // Créer le dossier de destination s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'posts_media');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    for (const file of files) {
      if (!file || !file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Écrire le fichier
      await writeFile(filePath, buffer);
      
      const fileUrl = `/posts_media/${fileName}`;
      
      uploadedFiles.push({
        url: fileUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        originalName: file.name
      });
    }

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles 
    });

  } catch (error) {
    console.error("Erreur lors de l'upload des fichiers:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload des fichiers" },
      { status: 500 }
    );
  }
}
