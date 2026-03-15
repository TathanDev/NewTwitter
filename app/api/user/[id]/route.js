import User from "@/entities/User";
import { Sequelize } from "sequelize";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const slug = (await params).id;

  // Vérifier si c'est un ID numérique
  const isNumericId = !isNaN(parseInt(slug)) && isFinite(slug);

  let user = null;

  // Si c'est un ID numérique, chercher d'abord par ID
  if (isNumericId) {
    user = await User.findOne({ where: { id_user: parseInt(slug) } });
  }

  // Sinon ou si pas trouvé, chercher par pseudo
  if (!user) {
    user = await User.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("pseudo_user")),
        slug.toLowerCase()
      ),
    });
  }

  // Dernier recours: chercher par id_user (en string) si pas encore trouvé
  if (!user) {
    user = await User.findOne({ where: { id_user: slug } });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
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
