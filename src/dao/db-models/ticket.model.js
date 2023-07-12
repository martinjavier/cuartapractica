import mongoose from "mongoose";

export const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: { type: String },
  purchase_datetime: { type: Date },
  amount: { type: Number },
  purchaser: { type: String },
});

let DbTicketModel = mongoose.model(ticketCollection, ticketSchema);

DbTicketModel.createIndexes();

export default DbTicketModel;
