import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("strictQuery", true);

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`✅ MongoDB connecté — ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ Échec de connexion MongoDB :", err.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB déconnecté");
  });
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
