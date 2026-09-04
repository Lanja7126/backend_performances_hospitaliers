import { Router } from "express";
import authRoutes from "./auth.routes.js";
import rapportsRoutes from "./rapports.routes.js";
import statsRoutes from "./stats.routes.js";
import predictionsRoutes from "./predictions.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/rapports", rapportsRoutes);
router.use("/stats", statsRoutes);
router.use("/predictions", predictionsRoutes);

export default router;
