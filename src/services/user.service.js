import { UserManager, UserModel } from "../dao/factory.js";

export const createUser = (user) => {
  try {
    let userAdded = UserManager.addUser(user);
    return userAdded;
  } catch (error) {
    return error.message;
  }
};

export const getUsers = () => {
  try {
    const users = UserManager.getUsers();
    return users;
  } catch (error) {
    return error.message;
  }
};

export const getUserById = (userId) => {
  try {
    const user = UserManager.getUserById(userId);
    return user;
  } catch (error) {
    return error.message;
  }
};

export const updateUser = (userId, user) => {
  try {
    const updatedUser = UserManager.updateUser(userId, user);
    return updatedUser;
  } catch (error) {
    return error.message;
  }
};

export const deleteUser = (userId) => {
  try {
    const deletedUser = UserManager.deleteUser(userId);
    return deletedUser;
  } catch (error) {
    return error.message;
  }
};

export const premiumUser = async (req, res) => {
  try {
    const userId = req;
    // Verifico si el usuario existe en la base de datos
    const user = await UserModel.findById(userId);
    const userRole = user.role;
    if (userRole == "user") {
      user.role = "premium";
    } else if (userRole === "premium") {
      user.role = "user";
    } else {
      return res.json({ status: "error", message: "Can not change user role" });
    }
    await UserModel.updateOne({ _id: user.id }, user);
    return "User role was modified";
  } catch (error) {
    console.log(error.message);
    //res.json({ status: "error", message: "Error trying to change user role" });
  }
};

export const getUserRole = async (req, res) => {
  try {
    const userId = req;
    // Verifico si el usuario existe en la base de datos
    const user = await UserModel.findById(userId);
    const userRole = user.role;
    return userRole;
  } catch (error) {
    console.log(error.message);
    //res.json({ status: "error", message: "Error trying to change user role" });
  }
};
