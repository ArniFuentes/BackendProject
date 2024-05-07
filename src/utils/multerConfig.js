import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadFolder = "";
    if (file.fieldname === "profileImage") {
      uploadFolder = "profiles";
    } else if (file.fieldname === "productImage") {
      uploadFolder = "products";
    } else {
      uploadFolder = "documents";
    }
    cb(null, `src/public/uploads/${uploadFolder}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;




