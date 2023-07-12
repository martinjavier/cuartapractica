import nodemailer from "nodemailer";
import { options } from "../config/options.js";

// CREDENCIALES

const adminEmail = options.gmail.adminAccount;
const adminPassword = options.gmail.adminPass;

// CONFIGURACION DEL CANAL DE COMUNICACIÓN ENTRE NODEJS Y GMAIL

export const transporter = nodemailer.createTransport({
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

export const sendRecoveryPass = async (userEmail, token) => {
  const link = `http://localhost:8080/reset-password?token=${token}`;
  // estructura del correo
  await transporter.sendMail({
    from: options.gmail.emailAdmin,
    to: userEmail,
    subject: "Restablecer contraseña",
    html: `
          <div>
            <h2>Has solicitado un cambio de contraseña</h2>
            <p>Da click en el siguiente enlace para restablecer la contraseña</p>
            <a href="${link}">
              <button>Restablecer contraseña</button>
            </a>
          </div>
        `,
  });
};
