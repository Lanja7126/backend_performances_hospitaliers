import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import { env, isProd } from "./config/env.js";
import routes from "./routes/index.js";
import { limiteurAPI } from "./middleware/rateLimiter.js";
import {
  routeIntrouvable,
  gestionnaireErreurs,
} from "./middleware/error.middleware.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(isProd ? "combined" : "dev"));
app.use("/api", limiteurAPI);

app.get("/api/health", (req, res) =>
  res.json({ statut: "ok", environnement: env.nodeEnv }),
);

app.get("/", (req, res) => {
  res.json({
    message: "API Plateforme Hospitalière — voir /api/health pour le statut.",
  });
});

app.use("/api", routes);

app.use(routeIntrouvable);
app.use(gestionnaireErreurs);

export default app;
