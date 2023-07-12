import mongoose from "mongoose";
import productModel from "../dao/db-models/product.model.js";
import { ConnectionDb } from "../config/dbConnection.js";

let connect = new ConnectionDb();

// Función para agregar el Owner a cada producto

const updateProducts = async () => {
  try {
    const adminId = "64933c9f6d7c7a3b5e484e71";
    const result = await productModel.updateMany(
      {},
      { $set: { owner: adminId } }
    );
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
};

updateProducts();
