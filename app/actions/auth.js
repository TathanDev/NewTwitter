"use server";

import bcrypt from "bcrypt";
import User from "@/entities/User";
import { redirect } from "next/navigation";
import { createSession, deleteSession, updateSession } from "@/utils/session";

export async function signup(formData) {
  const hash = await bcrypt.hash(formData.get("password"), 12);

  try {
    const user = await User.create({
      pseudo_user: formData.get("pseudo"),
      mail_user: formData.get("email"),
      password_user: hash,
    });
    await createSession(user.id_user);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
  } finally {
    redirect("/");
  }
}

export async function login(formData) {
  try {
    const user = await User.findOne({
      where: { mail_user: formData.get("email") },
    });

    const valide = bcrypt.compare(formData.get("password"), user.password_user);
    if (valide) {
      console.log(user);
      await createSession(user.id_user);
    }
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
  } finally {
    redirect("/");
  }
}

export async function updateProfile() {
  updateSession();
}

export async function logout() {
  deleteSession();
  redirect("/");
}
