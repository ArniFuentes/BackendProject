const { Router } = require("express");

const router = Router();

// Endpoint para probar los logs
router.get("/", (req, res) => {
  try {
    // Logs de diferentes niveles para probar
    req.logger.debug("Mensaje de depuración");
    req.logger.info("Mensaje informativo");
    req.logger.warning("Mensaje de advertencia");
    req.logger.error("Mensaje de error");

    res.send("Logs enviados correctamente para pruebas.");
  } catch (error) {
    req.logger.error("Error al enviar logs para pruebas:", error);
    res.status(500).send("Error al enviar logs para pruebas.");
  }
});

module.exports = router;
