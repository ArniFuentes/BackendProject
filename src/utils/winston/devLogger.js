import winston from "winston";

// Configuración del logger para desarrollo
const developmentLogger = winston.createLogger({
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
      level: "debug",  // De debug hacia arriba
    }),
  ],
});

export default developmentLogger;
