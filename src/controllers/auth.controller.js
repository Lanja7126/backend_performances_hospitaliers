import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

function genererToken(utilisateurId) {
  return jwt.sign({ id: utilisateurId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function serialiser(utilisateur) {
  return { id: utilisateur._id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role };
}

export const inscrire = asyncHandler(async (req, res) => {
  const { nom, email, motDePasse } = req.body;

  const existeDeja = await User.findOne({ email });
  if (existeDeja) {
    return res.status(409).json({ message: "Un compte existe déjà avec cet email." });
  }

  const utilisateur = await User.create({ nom, email, motDePasse });
  res.status(201).json({ utilisateur: serialiser(utilisateur), token: genererToken(utilisateur._id) });
});

export const connecter = asyncHandler(async (req, res) => {
  const { email, motDePasse } = req.body;

  const utilisateur = await User.findOne({ email }).select("+motDePasse");
  const motDePasseValide = utilisateur && (await utilisateur.comparerMotDePasse(motDePasse));

  if (!motDePasseValide) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect." });
  }

  res.json({ utilisateur: serialiser(utilisateur), token: genererToken(utilisateur._id) });
});

export const profil = asyncHandler(async (req, res) => {
  res.json({ utilisateur: serialiser(req.utilisateur) });
});
