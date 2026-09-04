import { isProd } from "../config/env.js";

export function routeIntrouvable(req, res, next) {
  res.status(404);
  next(new Error(`Route introuvable — ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function gestionnaireErreurs(err, req, res, next) {
  const statut = err.status || (res.statusCode !== 200 ? res.statusCode : 500);

  const reponse = { message: err.message || "Erreur interne du serveur." };
  if (err.details) reponse.details = err.details;
  if (!isProd) reponse.stack = err.stack;

  res.status(statut).json(reponse);
}
