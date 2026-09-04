import multer from "multer";

const storage = multer.memoryStorage();

function filtrerCSV(req, file, cb) {
  const estCSV = file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv");
  if (!estCSV) {
    return cb(new Error("Seuls les fichiers .csv sont acceptés."));
  }
  cb(null, true);
}

export const uploadCSV = multer({
  storage,
  fileFilter: filtrerCSV,
  limits: { fileSize: 20 * 1024 * 1024 },
});
