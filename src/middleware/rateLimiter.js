import rateLimit from "express-rate-limit";

export const limiteurAPI = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de requêtes — réessaie dans quelques minutes." },
});

export const limiteurAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de tentatives de connexion — réessaie dans quelques minutes." },
});
