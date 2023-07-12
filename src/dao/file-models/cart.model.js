import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    required: true,
    default: [],
  },
});

const FileCartModel = mongoose.model("carts", cartSchema);

export default FileCartModel;
