import { Router } from "express";

import {
  getTicketController,
  getTicketByIdController,
  createTicketController,
  updateTicketController,
  deleteTicketController,
} from "../controllers/tickets.controller.js";

const ticketsRouter = Router();

ticketsRouter.get("/", getTicketController);
ticketsRouter.get("/:tid", getTicketByIdController);
ticketsRouter.post("/", createTicketController);
ticketsRouter.put("/:tid", updateTicketController);
ticketsRouter.delete("/:tid", deleteTicketController);

export default ticketsRouter;
