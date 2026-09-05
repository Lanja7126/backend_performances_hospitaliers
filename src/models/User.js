import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    motDePasse: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["admin", "analyste"], default: "analyste" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("motDePasse")) return;
  
  this.motDePasse = await bcrypt.hash(this.motDePasse, 12);
});

userSchema.methods.comparerMotDePasse = function comparerMotDePasse(motDePasseCandidat) {
  return bcrypt.compare(motDePasseCandidat, this.motDePasse);
};

export default mongoose.model("User", userSchema);
