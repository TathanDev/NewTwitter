import User from "@/entities/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const slug = (await params).id; // 'a', 'b', or 'c'

  let user = await User.findOne({ where: { id_user: slug } });
  if (user == null) {
    user = await User.findOne({ where: { pseudo_user: slug } });
    if (user == null) {
      return NextResponse.json({ error: "User not found" });
    }
  }
  return NextResponse.json(user);
}

export async function PUT(request, { params }) {
  const slug = (await params).id;
  const body = await request.json();

  let user = await User.findOne({ where: { id_user: slug } });
  if (user == null) {
    user = await User.findOne({ where: { pseudo_user: slug } });
    if (user == null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  }

  // Met à jour les champs reçus dans le body
  await user.update(body);

  return NextResponse.json({ success: true, user });
}
