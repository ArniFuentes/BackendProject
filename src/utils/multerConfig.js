import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadFolder = "";
    if (file.fieldname === "profileImage") {
      uploadFolder = "profiles";
    }

    if (file.fieldname === "productImage") {
      uploadFolder = "products";
    }

    if (file.fieldname === "identification") {
      uploadFolder = "documents";
    }

    if (file.fieldname === "proof_of_address") {
      uploadFolder = "documents";
    }

    if (file.fieldname === "bank_statement") {
      uploadFolder = "documents";
    }

    cb(null, `src/public/uploads/${uploadFolder}`);
  },
  
  filename: function (req, file, cb) {
    // Genera un nuevo nombre de archivo basado en el ID del usuario y el timestamp
    const userId = req.params.uid;
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}_${file.fieldname}.png`; // Nuevo nombre de archivo
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

export default upload;
