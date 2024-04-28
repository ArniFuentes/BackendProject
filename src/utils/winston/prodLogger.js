import winston from "winston";

// Configuración del logger para producción
const productionLogger = winston.createLogger({
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  transports: [
    new winston.transports.Console({
      level: "info", // Solo loggear desde nivel info hacia arriba
    }),
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
    }),
  ],
});

export default productionLogger;
