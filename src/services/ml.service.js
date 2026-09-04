import axios from "axios";
import { env } from "../config/env.js";

const client = axios.create({ baseURL: env.mlServiceUrl, timeout: 8000 });

async function appelerServiceML(endpoint, payload) {
  try {
    const { data } = await client.post(endpoint, payload);
    return data;
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
      const erreur = new Error(
        "Le service de prédiction (FastAPI) est injoignable. Vérifie qu'il tourne bien sur " + env.mlServiceUrl
      );
      erreur.status = 503;
      throw erreur;
    }
    const erreur = new Error(err.response?.data?.detail || "Erreur du service de prédiction.");
    erreur.status = err.response?.status || 502;
    throw erreur;
  }
}

export const predireRisque = (rapport) => appelerServiceML("/predict/risque", rapport);
export const predireIGPH = (rapport) => appelerServiceML("/predict/igph", rapport);
export const predireCluster = (rapport) => appelerServiceML("/predict/cluster", rapport);
