import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";

async function demarrer() {
  await connectDB();

  const serveur = app.listen(env.port, "0.0.0.0", () => {
    console.log(
      `🚀 API démarrée sur http://localhost:${env.port} (${env.nodeEnv})`,
    );
  });

  process.on("unhandledRejection", (err) => {
    console.error("💥 Rejet de promesse non géré :", err);
    serveur.close(() => process.exit(1));
  });
}

demarrer();
