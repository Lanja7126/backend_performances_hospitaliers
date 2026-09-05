import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";

async function demarrer() {
  try {
    console.log("🔵 Démarrage du serveur...");
    console.log("🔵 PORT =", env.port);
    console.log("🔵 NODE_ENV =", env.nodeEnv);

    console.log("🟡 Connexion à MongoDB...");
    await connectDB();
    console.log("🟢 MongoDB connectée !");

    const serveur = app.listen(env.port, "0.0.0.0", () => {
      console.log(`🚀 API démarrée sur le port ${env.port} (${env.nodeEnv})`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("💥 Rejet de promesse non géré :", err);
      serveur.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("🔴 ERREUR AU DÉMARRAGE :", error);
    process.exit(1);
  }
}

demarrer();
