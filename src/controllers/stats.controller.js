import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  obtenirKpiNationaux,
  obtenirAgregationParRegion,
  obtenirHistoriqueHopital,
  obtenirMetaCategorielle,
  construireFiltreDashboard,
} from "../services/aggregation.service.js";
import RapportMensuel from "../models/RapportMensuel.js";

export const kpiNationaux = asyncHandler(async (req, res) => {
  const filtre = construireFiltreDashboard(req.query);
  const kpis = await obtenirKpiNationaux(filtre);
  res.json(kpis);
});

export const agregationRegions = asyncHandler(async (req, res) => {
  const filtre = construireFiltreDashboard(req.query);
  const regions = await obtenirAgregationParRegion(filtre);
  res.json({ regions });
});

export const historiqueHopital = asyncHandler(async (req, res) => {
  const historique = await obtenirHistoriqueHopital(req.params.codeHopital);
  if (historique.length === 0) {
    return res.status(404).json({ message: "Aucun rapport trouvé pour cet établissement." });
  }
  res.json({ historique });
});

export const listerEtablissements = asyncHandler(async (req, res) => {
  const etablissements = await RapportMensuel.aggregate([
    { $group: { _id: "$code_hopital", nom_hopital: { $first: "$nom_hopital" }, region: { $first: "$region" } } },
    { $project: { _id: 0, code_hopital: "$_id", nom_hopital: 1, region: 1 } },
    { $sort: { nom_hopital: 1 } },
  ]);
  res.json({ etablissements });
});

/** Valeurs distinctes des champs catégoriels — pour peupler les select du formulaire. */
export const metaCategorielle = asyncHandler(async (req, res) => {
  const meta = await obtenirMetaCategorielle();
  res.json(meta);
});
