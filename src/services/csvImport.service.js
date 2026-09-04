import Papa from "papaparse";
import RapportMensuel from "../models/RapportMensuel.js";
import { calculerVariablesDerivees, CHAMPS_OBLIGATOIRES } from "./featureEngineering.service.js";
import { recalculerIndicateursGlobaux } from "./metrics.service.js";

class ErreurImportCSV extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "ErreurImportCSV";
    this.details = details;
  }
}

function validerLigne(ligne, index) {
  const manquants = CHAMPS_OBLIGATOIRES.filter(
    (champ) => ligne[champ] === undefined || ligne[champ] === null || ligne[champ] === ""
  );
  if (manquants.length > 0) {
    return `Ligne ${index + 2} : champ(s) manquant(s) — ${manquants.join(", ")}`;
  }
  return null;
}

export async function importerCSV(fileBuffer) {
  const contenu = fileBuffer.toString("utf-8");

  const { data, errors } = Papa.parse(contenu, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    throw new ErreurImportCSV("Erreur de lecture du CSV", errors.map((e) => e.message));
  }
  if (data.length === 0) {
    throw new ErreurImportCSV("Le fichier CSV ne contient aucune ligne exploitable.");
  }

  const erreursValidation = data.map(validerLigne).filter(Boolean);
  if (erreursValidation.length > 0) {
    throw new ErreurImportCSV("Certaines lignes sont invalides", erreursValidation.slice(0, 20));
  }

  const operations = data.map((ligne) => {
    const document = calculerVariablesDerivees(ligne);
    return {
      updateOne: {
        filter: { code_hopital: document.code_hopital, annee: document.annee, mois: document.mois },
        update: { $set: document },
        upsert: true,
      },
    };
  });

  const resultat = await RapportMensuel.bulkWrite(operations, { ordered: false });
  const indicateurs = await recalculerIndicateursGlobaux();

  return {
    lignesLues: data.length,
    inseres: resultat.upsertedCount,
    misAJour: resultat.modifiedCount,
    indicateursGlobaux: indicateurs,
  };
}

export { ErreurImportCSV };
