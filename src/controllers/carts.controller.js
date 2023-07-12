import passport from "passport";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";
import { v4 as uuid_v4 } from "uuid";
import { twilioClient, twilioPhone } from "../config/twilio.js";
import {
  createCart,
  getCarts,
  getCartById,
  addProduct,
  deleteCart,
  cartPurchase,
} from "../services/cart.service.js";
import {
  getProductById,
  updateProductStock,
} from "../services/product.service.js";
import { createTicket } from "../services/ticket.service.js";

export const getCartsController = async (req, res) => {
  try {
    const carts = await getCarts();
    res.json({ status: "success", payload: carts });
  } catch (error) {
    res.json({ status: "error Controller", message: error.message });
  }
};

export const getCartByIdController = async (req, res) => {
  try {
    const cart = await getCartById(req.params.cid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const createCartController = async (req, res) => {
  try {
    const cartCreated = createCart(req.body);
    res.json({ status: "success", payload: cartCreated });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const deleteCartController = async (req, res) => {
  const cartId = req.params.cid;
  const result = await deleteCart(cartId);
  res.json({ status: "success", data: result });
};

export const addProductController = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const product = await getProductById(prodId);
    console.log("PRODUCT OWNER: " + JSON.stringify(product.owner));
    const productOwnerId = JSON.stringify(product.owner);
    let token = req.cookies[options.server.cookieToken];
    passport.authenticate("jwt", { session: false });
    const info = jwt.verify(token, options.server.secretToken);
    const userRole = JSON.stringify(info.role);
    const userId = JSON.stringify(info._id);
    let result = null;

    console.log("USER ROLE: " + userRole);
    console.log("USER ID: " + userId);
    console.log("Prod Owner ID: " + productOwnerId);

    if (userRole === "premium") {
      if (userId != productOwnerId) {
        result = await addProduct(cartId, prodId);
      } else {
        result = "Premium user can not add an own product to the Cart";
      }
    }
    res.json({ status: "success", payload: result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

// PUT
// localhost:8080/api/carts/646e74e5ad94d46e462834fc/purchase
export const purchaseCartController = async (req, res) => {
  try {
    const cartId = req.params.cid;
    console.log("Cart ID: " + cartId);

    const cart = await getCartById(cartId);
    console.log("Cart: " + cart);

    console.log("EN CART:");
    console.log("Cuantos Productos en el carrito: " + cart.products.length);

    const totalProductsInCart = cart.products.length;

    let amount = 0;

    for (let i = 0; i < totalProductsInCart; i++) {
      const IDProd = cart.products[i]._id;
      const QuantityProd = cart.products[i].quantity;

      console.log("Cart Product " + i + " ID: " + IDProd);
      console.log("Cart Product " + i + " Quantity: " + QuantityProd);

      const prod = await getProductById(IDProd);

      console.log("Product " + i + " Stock: " + prod.stock);
      console.log("Product " + i + " Price: " + prod.price);

      // Verifica el Stock de dicho producto
      if (prod.stock < QuantityProd) {
        // En caso que no haya stock informa al usuario
        res.json({
          status: "error",
          message: "There are not enough quantity of product " + IDProd,
        });
      } else {
        // Si lo hay realiza la reducción de stock en base a la cantidad de ese producto en el carrito
        const finalStock = prod.stock - QuantityProd;
        const result = await updateProductStock(IDProd, finalStock);
        amount += prod.price;
      }
    }

    const datetime = new Date();

    const codeTicket = uuid_v4();

    const newTicket = {
      code: codeTicket,
      purchase_datetime: datetime,
      amount: amount,
      purchaser: "martinjavierd@gmail.com",
    };

    const ticketCreation = await createTicket(newTicket);

    // ENVÍO DE SMS
    const message = await twilioClient.messages.create({
      body: "Su compra por $" + amount + " se ha realizado correctamente",
      from: twilioPhone,
      to: "+34697664291",
    });
    console.log("message:" + JSON.stringify(message));

    const result = cartPurchase(cartId);

    res.json({ status: "success", payload: ticketCreation });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};
