import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { faker } from "@faker-js/faker";
import { options } from "./config/options.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export { __dirname };

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

//const product = generateProduct();
//console.log(product);
