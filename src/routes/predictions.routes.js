import { Router } from "express";
import { predireRapport } from "../controllers/predictions.controller.js";
import { validerCorps } from "../middleware/validate.middleware.js";
import { schemaRapportBrut } from "../services/validationSchemas.js";

const router = Router();

router.post("/", validerCorps(schemaRapportBrut), predireRapport);

export default router;
