import { asyncHandler } from "../middleware/asyncHandler.js";
import { calculerVariablesDerivees } from "../services/featureEngineering.service.js";
import {
  predireRisque,
  predireIGPH,
  predireCluster,
} from "../services/ml.service.js";

export const predireRapport = asyncHandler(async (req, res) => {
  const rapportComplet = calculerVariablesDerivees(req.body);

  const [risque, igph, cluster] = await Promise.all([
    predireRisque(rapportComplet),
    predireIGPH(rapportComplet),
    predireCluster(rapportComplet),
  ]);

  res.json({
    proba_haut_risque: risque.proba_haut_risque,
    igph: igph.igph,
    cluster: cluster.cluster,
    categorie: cluster.categorie,
  });
});
