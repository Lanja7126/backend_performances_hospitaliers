import { z } from "zod";

export const schemaRapportBrut = z.object({
  annee: z.number().int(),
  mois: z.number().int().min(1).max(12),
  type_etablissement: z.string().min(1),
  region: z.string().min(1),
  zone_geographique: z.string().min(1),
  source_energie_principale: z.string().min(1),

  lits_disponibles: z.number().positive(),
  effectif_medecins_etp: z.number().positive(),
  effectif_paramedicaux_etp: z.number().positive(),

  admissions_totales: z.number().nonnegative(),
  journees_hospitalisation: z.number().nonnegative(),
  consultations_externes: z.number().nonnegative(),
  passages_urgences: z.number().nonnegative(),
  actes_chirurgicaux: z.number().nonnegative(),
  accouchements_totaux: z.number().nonnegative(),
  cesariennes: z.number().nonnegative(),

  cas_mas_admis: z.number().nonnegative().default(0),
  cas_paludisme_grave: z.number().nonnegative().default(0),
  jours_coupure_electricite: z.number().min(0).max(31).default(0),
  poches_sang_disponibles_moy: z.number().nonnegative().default(0),
  jours_rupture_stock_vitaux: z.number().min(0).max(31).default(0),
  deces_moins_24h: z.number().nonnegative().default(0),
  deces_plus_24h: z.number().nonnegative().default(0),

  recettes_fanome_mga: z.number().nonnegative(),
});

export const schemaRapportComplet = schemaRapportBrut.extend({
  code_hopital: z.string().min(1),
  nom_hopital: z.string().min(1),
  district: z.string().optional(),
});
