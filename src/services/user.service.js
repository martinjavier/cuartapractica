import { UserManager, UserModel } from "../dao/factory.js";

export const createUser = async (user) => {
  try {
    let userAdded = await UserManager.addUser(user);
    return userAdded;
  } catch (error) {
    return error.message;
  }
};

export const getUsers = async () => {
  try {
    const users = await UserManager.getUsers();
    return users;
  } catch (error) {
    return error.message;
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await UserManager.getUserById(userId);
    return user;
  } catch (error) {
    return error.message;
  }
};

export const updateUser = async (userId, user) => {
  try {
    const updatedUser = await UserManager.updateUser(userId, user);
    return updatedUser;
  } catch (error) {
    return error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const deletedUser = await UserManager.deleteUser(userId);
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
    // Validamos si el usuario ya subió todos los documentos, entonces puede ser premium
    if (user.documents.length < 3 && user.status !== "completo") {
      return res.json({
        status: "error",
        message: "User has not upload all documents yet",
      });
    } else {
      user.role = "premium";
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

export const uploadFile = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await UserModel.findById(userId);
    if (user) {
      console.log(req.files);
      const identificacion = req.files["identificacion"]?.[0] || null;
      const domicilio = req.files["domicilio"]?.[0] || null;
      const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
      const docs = [];
      if (identificacion) {
        docs.push({
          name: "identificacion",
          reference: identificacion.filename,
        });
      }
      if (domicilio) {
        docs.push({ name: "domicilio", reference: domicilio.filename });
      }
      if (estadoDeCuenta) {
        docs.push({
          name: "estadoDeCuenta",
          reference: estadoDeCuenta.filename,
        });
      }
      if (docs.length === 3) {
        user.status = "completo";
      } else {
        user.status = "incompleto";
      }
      user.documents = docs;
      const userUpdated = await UserModel.findByIdAndUpdate(userId, user);
      res.json({ status: "success", message: "Documents updated" });
    } else {
      res.json({ status: "error", message: "User doesn't exist" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", message: "Error uploading files" });
  }
};
