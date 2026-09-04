import RapportMensuel from "../models/RapportMensuel.js";

const POSITIFS = ["TOM", "disponibilite_stock", "recette_par_patient"];
const NEGATIFS = ["taux_mortalite", "consultations_par_medecin"];

function minMax(valeurs) {
  return { min: Math.min(...valeurs), max: Math.max(...valeurs) };
}

function normaliser(valeur, { min, max }) {
  if (max === min) return 0.5;
  return (valeur - min) / (max - min);
}

function quantile(valeursTriees, p) {
  const index = (valeursTriees.length - 1) * p;
  const bas = Math.floor(index);
  const haut = Math.ceil(index);
  if (bas === haut) return valeursTriees[bas];
  const poids = index - bas;
  return valeursTriees[bas] + poids * (valeursTriees[haut] - valeursTriees[bas]);
}

export async function recalculerIndicateursGlobaux() {
  const rapports = await RapportMensuel.find(
    {},
    [...POSITIFS, ...NEGATIFS, "jours_rupture_stock_vitaux"].join(" ")
  ).lean();

  if (rapports.length === 0) {
    return { rapportsMisAJour: 0 };
  }

  const bornes = {};
  for (const champ of [...POSITIFS, ...NEGATIFS]) {
    bornes[champ] = minMax(rapports.map((r) => r[champ]));
  }

  const mortaliteTriee = rapports.map((r) => r.taux_mortalite).sort((a, b) => a - b);
  const ruptureTriee = rapports.map((r) => r.jours_rupture_stock_vitaux || 0).sort((a, b) => a - b);
  const seuilMortalite = quantile(mortaliteTriee, 0.75);
  const seuilRupture = quantile(ruptureTriee, 0.75);

  const operations = rapports.map((r) => {
    const scoresPositifs = POSITIFS.map((champ) => normaliser(r[champ], bornes[champ]));
    const scoresNegatifs = NEGATIFS.map((champ) => 1 - normaliser(r[champ], bornes[champ]));
    const IGPH = [...scoresPositifs, ...scoresNegatifs].reduce((a, b) => a + b, 0) / 5;

    const haut_risque =
      r.taux_mortalite >= seuilMortalite || (r.jours_rupture_stock_vitaux || 0) >= seuilRupture;

    return {
      updateOne: {
        filter: { _id: r._id },
        update: { $set: { IGPH, haut_risque } },
      },
    };
  });

  await RapportMensuel.bulkWrite(operations, { ordered: false });

  return {
    rapportsMisAJour: operations.length,
    seuils: { taux_mortalite: seuilMortalite, jours_rupture_stock_vitaux: seuilRupture },
  };
}
