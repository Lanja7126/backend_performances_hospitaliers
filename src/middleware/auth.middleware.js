import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

export async function protegerRoute(req, res, next) {
  const enTete = req.headers.authorization;
  if (!enTete?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentification requise." });
  }

  try {
    const token = enTete.split(" ")[1];
    const payload = jwt.verify(token, env.jwtSecret);
    const utilisateur = await User.findById(payload.id);
    if (!utilisateur) {
      return res.status(401).json({ message: "Utilisateur introuvable." });
    }
    req.utilisateur = utilisateur;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}

export function autoriserRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.utilisateur?.role)) {
      return res.status(403).json({ message: "Accès refusé pour ce rôle." });
    }
    next();
  };
}
