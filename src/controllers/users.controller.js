import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  premiumUser,
  getUserRole,
} from "../services/user.service.js";
import { UserModel } from "../dao/factory.js";

export const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();
    res.json({ status: "success", payload: users });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.uid);
    res.json({ status: "success", payload: user });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const createUserController = async (req, res) => {
  try {
    const userCreated = createUser(req.body);
    res.json({ status: "success", payload: userCreated });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const updateUserController = (req, res) => {
  try {
    const userId = req.params.uid;
    const body = req.body;
    const result = updateUser(userId, body);
    res.json({ status: "success", data: result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const deleteUserController = (req, res) => {
  try {
    const userId = req.params.uid;
    const result = deleteUser(userId);
    res.json({ status: "success", data: result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const premiumUserController = (req, res) => {
  try {
    const userId = req.params.uid;
    const result = premiumUser(userId);
    res.json({ status: "success", data: result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

export const getUserRoleController = (req, res) => {
  try {
    const userId = req.params.uid;
    const result = getUserRole(userId);
    res.json({ status: "success", data: result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};
