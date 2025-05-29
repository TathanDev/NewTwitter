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
