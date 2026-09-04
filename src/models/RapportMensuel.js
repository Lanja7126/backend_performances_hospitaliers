import mongoose from "mongoose";

const rapportMensuelSchema = new mongoose.Schema(
  {
    code_hopital: { type: String, required: true, trim: true },
    nom_hopital: { type: String, required: true, trim: true },
    type_etablissement: { type: String, required: true },
    region: { type: String, required: true, index: true },
    district: { type: String },
    zone_geographique: { type: String, required: true },
    source_energie_principale: { type: String },

    annee: { type: Number, required: true, index: true },
    mois: { type: Number, required: true, min: 1, max: 12 },

    lits_disponibles: { type: Number, required: true },
    effectif_medecins_etp: { type: Number, required: true },
    effectif_paramedicaux_etp: { type: Number, required: true },

    admissions_totales: { type: Number, required: true },
    journees_hospitalisation: { type: Number, required: true },
    consultations_externes: { type: Number, required: true },
    passages_urgences: { type: Number, required: true },
    actes_chirurgicaux: { type: Number, required: true },
    accouchements_totaux: { type: Number, required: true },
    cesariennes: { type: Number, required: true },

    cas_mas_admis: { type: Number, default: 0 },
    cas_paludisme_grave: { type: Number, default: 0 },
    jours_coupure_electricite: { type: Number, default: 0 },
    poches_sang_disponibles_moy: { type: Number, default: 0 },
    jours_rupture_stock_vitaux: { type: Number, default: 0 },
    deces_moins_24h: { type: Number, default: 0 },
    deces_plus_24h: { type: Number, default: 0 },

    recettes_fanome_mga: { type: Number, required: true },

    jours_mois: Number,
    TOM: Number,
    DMS: Number,
    taux_cesarienne: Number,
    deces_total: Number,
    taux_mortalite: Number,
    consultations_par_medecin: Number,
    patients_paramedicaux: Number,
    disponibilite_stock: Number,
    recette_par_patient: Number,

    IGPH: { type: Number, default: null },
    haut_risque: { type: Boolean, default: null },
    cluster: { type: Number, default: null },
    categorie: {
      type: String,
      enum: ["Performance élevée", "Performance satisfaisante", "Performance fragile", "Sous forte tension", null],
      default: null,
    },
  },
  { timestamps: true }
);

rapportMensuelSchema.index({ code_hopital: 1, annee: 1, mois: 1 }, { unique: true });

export default mongoose.model("RapportMensuel", rapportMensuelSchema);
