import { CartManager } from "../dao/factory.js";

export const createCart = async (cart) => {
  try {
    const cartAdded = await CartManager.createCart(cart);
    return cartAdded;
  } catch (error) {
    return error.message;
  }
};

export const getCarts = async () => {
  try {
    const carts = await CartManager.getCarts();
    return carts;
  } catch (error) {
    return error.message;
  }
};

export const getCartById = async (cartId) => {
  try {
    const cart = await CartManager.getOneCart(cartId);
    return cart;
  } catch (error) {
    return error.message;
  }
};

export const addJustOneProduct = async (cartId, productId) => {
  try {
    const productAdded = await CartManager.addOneProduct(cartId, productId);
    return productAdded;
  } catch (error) {
    return error.message;
  }
};

export const deleteCart = async (cartId) => {
  try {
    const deletedCart = await CartManager.deleteOneCart(cartId);
    return deletedCart;
  } catch (error) {
    return error.message;
  }
};

export const cartPurchase = async (cartId) => {
  try {
    let purchasedCart = await CartManager.purchaseCart(cartId);
    return purchasedCart;
  } catch (error) {
    return error.message;
  }
};
