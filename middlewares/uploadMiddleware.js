import multer from "multer";
import path from "path";

// Carpeta de destino
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `photo_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

export default upload;
