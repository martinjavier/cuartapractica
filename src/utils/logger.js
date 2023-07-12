import winston from "winston";
import * as dotenv from "dotenv";
import { __dirname } from "../utils.js";
import path from "path";

// Ejecutamos la configuración de dotenv
dotenv.config();

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warn: "yellow",
    info: "blue",
    http: "green",
    verbose: "brown",
    debug: "white",
    silly: "cyan",
  },
};

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    // Definir los diferentes sistemas de almacenamiento de logs (mensajes/registros)
    new winston.transports.Console({ level: "http" }),
    new winston.transports.File({
      filename: path.join(__dirname, "/logs/errores.log"),
      level: "warn",
    }),
  ],
});

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    // Definir los diferentes sistemas de almacenamiento de logs (mensajes/registros)
    new winston.transports.Console({ level: "verbose" }),
  ],
});

const currentEnv = process.env.NODE_ENV || "development";

// Crear un middleware para agregar el logger al objeto request
export const addLogger = (req, res, next) => {
  if (currentEnv === "development") {
    req.logger = devLogger;
  } else {
    req.logger = prodLogger;
  }
  req.logger.http(`${req.url} - method: ${req.method}`);
  next();
};
