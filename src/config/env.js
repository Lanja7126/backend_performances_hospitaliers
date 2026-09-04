import "dotenv/config";

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/plateforme_hospitaliere",
  jwtSecret: process.env.JWT_SECRET || "GVASGASGASGSfefjzaabkfbekbdshcbdh",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://localhost:8000",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

export const isProd = env.nodeEnv === "production";

if (isProd && env.jwtSecret === "change_moi_en_production") {
  throw new Error("JWT_SECRET doit être défini dans .env avant tout déploiement en production.");
}
