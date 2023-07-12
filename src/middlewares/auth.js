import passport from "passport";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";

export const checkRole = (roles) => {
  return (req, res, next) => {
    let token = req.cookies[options.server.cookieToken];
    passport.authenticate("jwt", { session: false });
    const info = jwt.verify(token, options.server.secretToken);
    console.log("CHECKROLE");

    // AUTENTICADO - Verifico si está logueado
    if (!info._id) {
      return res.json({
        status: "error",
        message: "You need to be authenticated",
      });
    } else {
      console.log("Authenticated!");
    }

    // AUTORIZADO - Verificar el rol del usuario
    if (!info.role) {
      return res.json({ status: "error", message: "You are not authorized" });
    } else {
      console.log("Authorized!");
    }

    next();
  };
};
