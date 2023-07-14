import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { faker } from "@faker-js/faker";
import { options } from "./config/options.js";
import multer from "multer";
import passport from "passport";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export { __dirname };

/*
const validFields = (body) => {
  const { first_name, last_name, email, password, avatar } = body;
  if (!first_name || !last_name || !email || !password || !avatar) {
    return false;
  } else {
    return true;
  }
};

// Filtro para validar los campos antes de cargar la imagen
const multerFilterProfile = (req, file, cb) => {
  const isValid = validFields(req.body);
  if (!isValid) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};
*/

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    thumnail: faker.commerce.department(),
    code: parseInt(faker.string.numeric(2)),
    stock: parseInt(faker.string.numeric(2)),
    status: "true",
    category: "Tecnología",
  };
};

export const generateEmailToken = (email, expireTime) => {
  const token = jwt.sign({ email }, options.gmail.emailToken, {
    expiresIn: expireTime,
  });
  return token;
};

export const verifyEmailToken = (token) => {
  try {
    const info = jwt.verify(token, options.gmail.emailToken);
    return info.email;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

// configuración para guardar imágenes de usuarios
const profileStorage = multer.diskStorage({
  // Donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/multer/users/images"));
  },
  // Que nombre tendrá el archivo que guardaremos
  filename: function (req, file, cb) {
    cb(null, `${req.body.email}-profile-${file.originalname}`);
  },
});

// Creamos el uploader de Multer
export const uploaderProfile = multer({
  storage: profileStorage,
});

// configuración para guardar los documentos del usuario
const documentStorage = multer.diskStorage({
  // Donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/multer/users/documents"));
  },
  // Que nombre tendrá el archivo que guardaremos
  filename: function (req, file, cb) {
    let token = req.cookies[options.server.cookieToken];
    passport.authenticate("jwt", { session: false });
    const info = jwt.verify(token, options.server.secretToken);
    const email = info.email;
    cb(null, `${email}-document-${file.originalname}`);
  },
});

// Creamos el uploader de Multer
export const uploaderDocument = multer({ storage: documentStorage });

// configuración para guardar los productos del usuario
const productStorage = multer.diskStorage({
  // Donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/multer/products/images"));
  },
  // Que nombre tendrá el archivo que guardaremos
  filename: function (req, file, cb) {
    cb(null, `${req.body.code}-image-${file.originalname}`);
  },
});

// Creamos el uploader de Multer
export const uploaderProduct = multer({ storage: productStorage });

// Ejemplo de como utilizar los uploader
//router.post("/user", uploaderProfile.single("avatar"), (req, res) => {});
