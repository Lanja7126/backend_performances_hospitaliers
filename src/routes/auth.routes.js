import { Router } from "express";
import { z } from "zod";
import { inscrire, connecter, profil } from "../controllers/auth.controller.js";
import { validerCorps } from "../middleware/validate.middleware.js";
import { protegerRoute } from "../middleware/auth.middleware.js";
import { limiteurAuth } from "../middleware/rateLimiter.js";

const router = Router();

const schemaInscription = z.object({
  nom: z.string().min(2),
  email: z.string().email(),
  motDePasse: z.string().min(8),
});

const schemaConnexion = z.object({
  email: z.string().email(),
  motDePasse: z.string().min(1),
});

router.post("/inscription", limiteurAuth, validerCorps(schemaInscription), inscrire);
router.post("/connexion", limiteurAuth, validerCorps(schemaConnexion), connecter);
router.get("/profil", protegerRoute, profil);

export default router;
