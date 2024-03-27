const errorDictionary = require("../../handlers/errors/error-diccionary");

const errorMiddleware = (err, req, res, next) => {
  if (err.code === errorDictionary.PRODUCT_UPDATE_ERROR) {
    return res.status(400).json({
      status: "error",
      error: err.message,
    });
  }

  if (err.code === errorDictionary.PRODUCT_CREATION_ERROR) {
    return res.status(400).json({ status: "error", error: err.message });
  }

  if (err.code === errorDictionary.VALIDATION_ERROR) {
    // Mensaje de error personalizado para errores de validación
    return res.status(400).json({
      status: "error",
      error: err.message,
    });
  }

  // Devolver un error interno del servidor
  res.status(500).json({ status: "error", error: "Internal Server Error" });
};

module.exports = errorMiddleware;
