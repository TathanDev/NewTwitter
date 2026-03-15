"use server";

import bcrypt from "bcrypt";
import { z } from "zod";
import User from "@/entities/User";
import { redirect } from "next/navigation";
import { createSession, deleteSession, updateSession } from "@/utils/session";

// Sanitization: strip HTML tags to prevent XSS
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "");
}

// Zod schemas for validation
const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe ne peut pas être vide"),
});

const registerSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[!@#$%^&*(),.?\":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  pseudo: z
    .string()
    .min(3, "Le pseudo doit contenir au moins 3 caractères")
    .max(20, "Le pseudo ne peut pas dépasser 20 caractères"),
});

export async function signup(formData) {
  // Extract and sanitize inputs
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    pseudo: formData.get("pseudo"),
  };

  // Validate with Zod
  const validation = registerSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMessages = validation.error.issues.map((issue) => issue.message).join(", ");
    throw new Error(errorMessages);
  }

  const { email, password, pseudo } = validation.data;

  // Additional sanitization for text fields
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPseudo = sanitizeInput(pseudo);

  const hash = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      pseudo_user: sanitizedPseudo,
      mail_user: sanitizedEmail,
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
  // Extract and sanitize inputs
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate with Zod
  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMessages = validation.error.issues.map((issue) => issue.message).join(", ");
    throw new Error(errorMessages);
  }

  const { email, password } = validation.data;

  // Sanitize email
  const sanitizedEmail = sanitizeInput(email);

  try {
    const user = await User.findOne({
      where: { mail_user: sanitizedEmail },
    });

    const valide = bcrypt.compare(password, user.password_user);
    if (valide) {
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
  console.log("Déconnexion de l'utilisateur");
  deleteSession();
  redirect("/");
}