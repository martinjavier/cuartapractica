import passport from "passport";
import jwt from "jsonwebtoken";
import {
  getProducts,
  getProductById,
  getMockingProducts,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
  getPaginateProducts,
} from "../services/product.service.js";
import { getUserRole } from "../services/user.service.js";
import { CustomError } from "../services/customError.service.js";
import { EError } from "../enums/EError.js";
import { generateProductErrorParam } from "../services/productErrorParams.js";
import { options } from "../config/options.js";
import { ProductManager } from "../dao/factory.js";

export const getProductsController = async (req, res) => {
  try {
    const products = await getProducts();
    res.json({ status: "success", payload: products });
  } catch (error) {
    res.json({ status: "error Controller", message: error.message });
  }
};

export const getMockingProductsController = async (req, res) => {
  try {
    const products = await getMockingProducts();
    res.json({ status: "success", payload: products });
  } catch (error) {
    res.json({ status: "error Controller", message: error.message });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    console.log("ESTOY EN EL PRODUCT CONTROLLER");
    console.log("REQ PARAMS PID: " + JSON.stringify(req.params.pid));
    const product = await getProductById(req.params.pid);
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const createProductController = async (req, res) => {
  try {
    let token = req.cookies[options.server.cookieToken];
    passport.authenticate("jwt", { session: false });
    const info = jwt.verify(token, options.server.secretToken);
    let userId = "admin";
    if (info._id) {
      userId = info._id;
    }
    let product = req.body;
    product.owner = userId;
    const productCreated = createProduct(product);
    res.json({ status: "success", payload: productCreated });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const updateProductController = (req, res) => {
  const productId = req.params.pid;
  const body = req.body;
  const result = updateProduct(productId, body);
  res.json({ status: "success", data: result });
};

export const updateProductStockController = (req, res) => {
  const productId = req.params.pid;
  if (!productId) {
    CustomError.createError({
      name: "Update Product error",
      cause: generateProductErrorParam(productId),
      message: "Error updating product",
      errorCode: EError.INVALID_PARAM,
    });
  }
  const productStock = req.params.stock;
  if (!productStock) {
    CustomError.createError({
      name: "Update Stock error",
      cause: generateProductErrorParam(productStock),
      message: "Error updating stock",
      errorCode: EError.INVALID_PARAM,
    });
  }
  const result = updateProductStock(productId, productStock);
  res.json({ status: "success", data: result });
};

export const deleteProductController = async (req, res) => {
  // Obtengo el Product ID
  const productId = req.params.pid;
  // Obtengo el rol del usuario
  let token = req.cookies[options.server.cookieToken];
  passport.authenticate("jwt", { session: false });
  const info = jwt.verify(token, options.server.secretToken);
  const userId = info._id;
  const userRole = info.role;
  // Obtengo el producto
  //const product = ProductManager.getProductById(productId);
  const product = await getProductById(productId);
  // Obtengo el ID del product owner de este producto
  const productOwnerId = product.owner;
  // Con dicho ID busco el Role de ese usuario
  const productOwnerRole = await getUserRole(productOwnerId);
  let result = null;
  // Verifico
  // 1. Que los productos que pertenecen a un usuario premium sólo puedan ser borrados por dicho usuario o un admin.
  // 2. Que los productos que pertenecen a un usuario user lo pueden borrar todos.
  // 3. Que los productos que pertenecen a un usuario admin sólo lo pueda borrar un usuario admin.
  if (
    productOwnerRole == "premium" &&
    (productOwnerId == userId || userRole == "admin")
  ) {
    result = deleteProduct(productId);
  } else if (productOwnerRole == "user") {
    result = deleteProduct(productId);
  } else if (productOwnerRole == "admin" && userRole == "admin") {
    result = deleteProduct(productId);
  } else {
    result = "You don't have right to delete this file";
  }
  res.json({ status: "success", data: result });
};

export const getPaginateProductsController = (req, res) => {
  const query = req.params.query;
  const options = req.params.options;
  const result = getPaginateProducts(query, options);
  res.json({ status: "success", data: result });
};
