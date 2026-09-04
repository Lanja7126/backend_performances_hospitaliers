import RapportMensuel from "../models/RapportMensuel.js";

function modeStatistique(valeurs) {
  const comptes = new Map();
  for (const v of valeurs) comptes.set(v, (comptes.get(v) || 0) + 1);
  return [...comptes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export async function obtenirKpiNationaux(filtre) {
  const [resultat] = await RapportMensuel.aggregate([
    { $match: filtre },
    {
      $group: {
        _id: null,
        nbRapports: { $sum: 1 },
        hopitaux: { $addToSet: "$code_hopital" },
        regions: { $addToSet: "$region" },
        igphMoyen: { $avg: "$IGPH" },
        pctHautRisque: { $avg: { $cond: ["$haut_risque", 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        nbRapports: 1,
        nbHopitaux: { $size: "$hopitaux" },
        nbRegions: { $size: "$regions" },
        igphMoyen: 1,
        pctHautRisque: 1,
      },
    },
  ]);

  return resultat || { nbRapports: 0, nbHopitaux: 0, nbRegions: 0, igphMoyen: 0, pctHautRisque: 0 };
}

export async function obtenirAgregationParRegion(filtre) {
  const lignes = await RapportMensuel.aggregate([
    { $match: filtre },
    {
      $group: {
        _id: "$region",
        hopitaux: { $addToSet: "$code_hopital" },
        igphMoyen: { $avg: "$IGPH" },
        tauxMortaliteMoyen: { $avg: "$taux_mortalite" },
        pctHautRisque: { $avg: { $cond: ["$haut_risque", 1, 0] } },
        categories: { $push: "$categorie" },
      },
    },
    {
      $project: {
        _id: 0,
        region: "$_id",
        nbHopitaux: { $size: "$hopitaux" },
        igphMoyen: 1,
        tauxMortaliteMoyen: 1,
        pctHautRisque: 1,
        categories: 1,
      },
    },
    { $sort: { region: 1 } },
  ]);

  return lignes.map((l) => ({
    ...l,
    categorieDominante: modeStatistique(l.categories),
    categories: undefined,
  }));
}

export async function obtenirHistoriqueHopital(codeHopital) {
  return RapportMensuel.find({ code_hopital: codeHopital }).sort({ annee: 1, mois: 1 }).lean();
}

export function construireFiltreDashboard(query) {
  const filtre = {};
  if (query.annee) {
    const annees = Array.isArray(query.annee) ? query.annee : [query.annee];
    filtre.annee = { $in: annees.map(Number) };
  }
  if (query.type_etablissement) {
    filtre.type_etablissement = Array.isArray(query.type_etablissement)
      ? { $in: query.type_etablissement }
      : query.type_etablissement;
  }
  if (query.zone_geographique) {
    filtre.zone_geographique = Array.isArray(query.zone_geographique)
      ? { $in: query.zone_geographique }
      : query.zone_geographique;
  }
  return filtre;
}

/** Valeurs distinctes des champs catégoriels — alimente les select/datalist du frontend. */
export async function obtenirMetaCategorielle() {
  const [regions, typesEtablissement, zonesGeographiques, sourcesEnergie] = await Promise.all([
    RapportMensuel.distinct("region"),
    RapportMensuel.distinct("type_etablissement"),
    RapportMensuel.distinct("zone_geographique"),
    RapportMensuel.distinct("source_energie_principale"),
  ]);

  return {
    regions: regions.sort(),
    typesEtablissement: typesEtablissement.sort(),
    zonesGeographiques: zonesGeographiques.sort(),
    sourcesEnergie: sourcesEnergie.sort(),
  };
}
