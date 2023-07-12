import { __dirname } from "../utils.js";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";

// Crear las definiciones de Swagger para la Documentación
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Products Documentation",
      version: "1.0.0",
      description: "Products API REST",
    },
  },
  apis: [`${path.join(__dirname, "docs/**/*.yaml")}`],
};

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);
