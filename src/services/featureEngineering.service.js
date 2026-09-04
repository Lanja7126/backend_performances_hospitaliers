function joursDansLeMois(annee, mois) {
  return new Date(annee, mois, 0).getDate();
}

function diviserSansCrash(numerateur, denominateur) {
  if (!denominateur || denominateur === 0) return 0;
  return numerateur / denominateur;
}

export function calculerVariablesDerivees(brut) {
  const jours_mois = joursDansLeMois(brut.annee, brut.mois);

  const TOM = diviserSansCrash(brut.journees_hospitalisation, brut.lits_disponibles * jours_mois) * 100;
  const DMS = diviserSansCrash(brut.journees_hospitalisation, brut.admissions_totales);
  const taux_cesarienne = diviserSansCrash(brut.cesariennes, brut.accouchements_totaux) * 100;
  const deces_total = (brut.deces_moins_24h || 0) + (brut.deces_plus_24h || 0);
  const taux_mortalite = diviserSansCrash(deces_total, brut.admissions_totales) * 100;
  const consultations_par_medecin = diviserSansCrash(brut.consultations_externes, brut.effectif_medecins_etp);
  const patients_paramedicaux = diviserSansCrash(brut.admissions_totales, brut.effectif_paramedicaux_etp);
  const disponibilite_stock = 100 - diviserSansCrash(brut.jours_rupture_stock_vitaux || 0, jours_mois) * 100;
  const recette_par_patient = diviserSansCrash(brut.recettes_fanome_mga, brut.admissions_totales);

  return {
    ...brut,
    jours_mois,
    TOM,
    DMS,
    taux_cesarienne,
    deces_total,
    taux_mortalite,
    consultations_par_medecin,
    patients_paramedicaux,
    disponibilite_stock,
    recette_par_patient,
  };
}

export const CHAMPS_OBLIGATOIRES = [
  "code_hopital", "nom_hopital", "type_etablissement", "region", "zone_geographique",
  "annee", "mois", "lits_disponibles", "effectif_medecins_etp", "effectif_paramedicaux_etp",
  "admissions_totales", "journees_hospitalisation", "consultations_externes",
  "passages_urgences", "actes_chirurgicaux", "accouchements_totaux", "cesariennes",
  "recettes_fanome_mga",
];
