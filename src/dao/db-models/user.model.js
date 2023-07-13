import mongoose from "mongoose";
import DbCartModel from "./cart.model.js";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DbCartModel,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  documents: {
    type: [
      {
        name: { type: String, required: true },
        reference: { type: String, required: true },
      },
    ],
    default: [],
  },
  last_connection: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enums: ["completo", "incompleto", "pendiente"],
    default: "pendiente",
  },
  avatar: {
    type: String,
    default: "",
  },
});

let userModel = mongoose.model(userCollection, userSchema);

export default userModel;
