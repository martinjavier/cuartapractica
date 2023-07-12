import { Router } from "express";
import {
  createUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
  deleteUserController,
  premiumUserController,
} from "../controllers/users.controller.js";
import { checkRole } from "../middlewares/auth.js";

const usersRouter = Router();

usersRouter.get("/", getUsersController);
usersRouter.get("/:uid", getUserByIdController);
usersRouter.post("/", createUserController);
usersRouter.put("/:uid", updateUserController);
usersRouter.delete("/:uid", deleteUserController);
usersRouter.put("/premium/:uid", checkRole(["admin"]), premiumUserController);

export default usersRouter;
