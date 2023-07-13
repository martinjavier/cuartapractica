import { Router } from "express";
import {
  createUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
  deleteUserController,
  premiumUserController,
  uploadFileController,
} from "../controllers/users.controller.js";
import { checkRole } from "../middlewares/auth.js";
import { isUserAuthenticate } from "../middlewares/validations.js";
import { uploaderDocument } from "../utils.js";

const usersRouter = Router();

usersRouter.get("/", getUsersController);
usersRouter.get("/:uid", getUserByIdController);
usersRouter.post("/", createUserController);
usersRouter.put("/:uid", updateUserController);
usersRouter.delete("/:uid", deleteUserController);
usersRouter.put("/premium/:uid", checkRole(["admin"]), premiumUserController);
usersRouter.put(
  "/:uid/documents",
  uploaderDocument.array("document"),
  uploadFileController
);

export default usersRouter;
