import nodemailer from "nodemailer";
import { options } from "./options.js";

// CREDENCIALES

const adminEmail = options.gmail.adminAccount;
const adminPassword = options.gmail.adminPass;

// CONFIGURACION DEL CANAL DE COMUNICACIÓN ENTRE NODEJS Y GMAIL

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: adminEmail,
    pass: adminPassword,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

export { transporter };
