export function validerCorps(schema) {
  return (req, res, next) => {
    const resultat = schema.safeParse(req.body);
    if (!resultat.success) {
      return res.status(400).json({
        message: "Données invalides.",
        details: resultat.error.issues.map((i) => `${i.path.join(".")} — ${i.message}`),
      });
    }
    req.body = resultat.data;
    next();
  };
}
