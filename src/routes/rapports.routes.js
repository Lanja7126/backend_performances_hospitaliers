import { Router } from "express";
import {
  importerRapportsCSV,
  listerRapports,
  obtenirRapport,
  creerRapportManuel,
} from "../controllers/rapports.controller.js";
import { protegerRoute, autoriserRoles } from "../middleware/auth.middleware.js";
import { uploadCSV } from "../middleware/upload.middleware.js";
import { validerCorps } from "../middleware/validate.middleware.js";
import { schemaRapportComplet } from "../services/validationSchemas.js";

const router = Router();

router.get("/", listerRapports);
router.get("/:id", obtenirRapport);

router.post(
  "/import",
  protegerRoute,
  autoriserRoles("admin", "analyste"),
  uploadCSV.single("fichier"),
  importerRapportsCSV
);

// Saisie manuelle d'un rapport (formulaire progressif côté frontend)
router.post(
  "/",
  protegerRoute,
  autoriserRoles("admin", "analyste"),
  validerCorps(schemaRapportComplet),
  creerRapportManuel
);

export default router;
