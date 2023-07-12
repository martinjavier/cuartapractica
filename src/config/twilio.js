import twilio from "twilio";
import { options } from "../config/options.js";

// Agregar las credenciales para usar el servicio de twilio
const twilioAccountId = options.twilio.id;
const twilioToken = options.twilio.token;

// Twilio Phone
export const twilioPhone = options.twilio.phone;

// Creación del cliente de Twilio
export const twilioClient = twilio(twilioAccountId, twilioToken);
