import { CartManager } from "../dao/factory.js";

export const createCart = (cart) => {
  try {
    const cartAdded = CartManager.createCart(cart);
    console.log("Creando la CART: " + cartAdded);
    return cartAdded;
  } catch (error) {
    return error.message;
  }
};

export const getCarts = () => {
  try {
    const carts = CartManager.getCarts();
    return carts;
  } catch (error) {
    return error.message;
  }
};

export const getCartById = (cartId) => {
  try {
    const cart = CartManager.getOneCart(cartId);
    return cart;
  } catch (error) {
    return error.message;
  }
};

export const addProduct = (cartId, productId) => {
  try {
    const productAdded = CartManager.addOneProduct(cartId, productId);
    return productAdded;
  } catch (error) {
    return error.message;
  }
};

export const deleteCart = (cartId) => {
  try {
    const deletedCart = CartManager.deleteOneCart(cartId);
    return deletedCart;
  } catch (error) {
    return error.message;
  }
};

export const cartPurchase = (cartId) => {
  try {
    let purchasedCart = CartManager.purchaseCart(cartId);
    return purchasedCart;
  } catch (error) {
    return error.message;
  }
};
