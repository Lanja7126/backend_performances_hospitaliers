import RapportMensuel from "../models/RapportMensuel.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { importerCSV } from "../services/csvImport.service.js";
import { calculerVariablesDerivees } from "../services/featureEngineering.service.js";
import { recalculerIndicateursGlobaux } from "../services/metrics.service.js";
import { predireCluster } from "../services/ml.service.js";

export const importerRapportsCSV = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu (champ attendu : 'fichier')." });
  }

  const resultat = await importerCSV(req.file.buffer);
  res.status(201).json(resultat);
});

/** Création manuelle d'un rapport (formulaire progressif côté frontend). */
export const creerRapportManuel = asyncHandler(async (req, res) => {
  const document = calculerVariablesDerivees(req.body);

  const cluster = await predireCluster(document);

  document.cluster = cluster.cluster;
  document.categorie = cluster.categorie;

  const rapport = await RapportMensuel.findOneAndUpdate(
    { code_hopital: document.code_hopital, annee: document.annee, mois: document.mois },
    { $set: document },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const indicateursGlobaux = await recalculerIndicateursGlobaux();

  res.status(201).json({ rapport, indicateursGlobaux });
});

export const listerRapports = asyncHandler(async (req, res) => {
  const { annee, type_etablissement, zone_geographique, region, page = 1, limite = 50 } = req.query;

  const filtre = {};
  if (annee) filtre.annee = Number(annee);
  if (type_etablissement) filtre.type_etablissement = type_etablissement;
  if (zone_geographique) filtre.zone_geographique = zone_geographique;
  if (region) filtre.region = region;

  const [rapports, total] = await Promise.all([
    RapportMensuel.find(filtre)
      .sort({ annee: -1, mois: -1 })
      .skip((Number(page) - 1) * Number(limite))
      .limit(Number(limite))
      .lean(),
    RapportMensuel.countDocuments(filtre),
  ]);

  res.json({ rapports, total, page: Number(page), limite: Number(limite) });
});

export const obtenirRapport = asyncHandler(async (req, res) => {
  const rapport = await RapportMensuel.findById(req.params.id).lean();
  if (!rapport) {
    return res.status(404).json({ message: "Rapport introuvable." });
  }
  res.json({ rapport });
});
