import { Router } from "express";
import {
  kpiNationaux,
  agregationRegions,
  historiqueHopital,
  listerEtablissements,
  metaCategorielle,
} from "../controllers/stats.controller.js";

const router = Router();

router.get("/kpis", kpiNationaux);
router.get("/regions", agregationRegions);
router.get("/etablissements", listerEtablissements);
router.get("/etablissements/:codeHopital/historique", historiqueHopital);
router.get("/meta", metaCategorielle);

export default router;
