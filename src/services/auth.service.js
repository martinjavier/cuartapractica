import { UserManager, UserModel } from "../dao/factory.js";
import alert from "alert";
import jwt from "jsonwebtoken";
import passport from "passport";
import { options } from "../config/options.js";
import { isValidPassword, createHash, verifyEmailToken } from "../utils.js";
import { sendRecoveryPass } from "../utils/email.js";
import { generateEmailToken } from "../utils.js";
import { createCart } from "../services/cart.service.js";

export const signup = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const user = await UserManager.getUserByEmail(email);
    if (!user) {
      let role = "user";
      if (email.endsWith("@coder.com")) {
        role = "admin";
      }
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role,
        cart: await createCart(),
        avatar: req.file.filename,
      };
      const userCreated = await UserManager.addUser(newUser);
      return userCreated;
    } else {
      alert("User was already registered");
      res.redirect("/login");
    }
  } catch (error) {
    //res.json({ stats: "error", message: error.message });
    console.log(error.message);
  }
};

export const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await UserManager.getUserByEmail(email);
    if (user) {
      if (isValidPassword(user, password)) {
        const token = jwt.sign(
          {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart,
            avatar: user.avatar,
          },
          options.server.secretToken,
          { expiresIn: "24h" }
        );
        res.cookie(options.server.cookieToken, token, {
          httpOnly: true,
        });
        user.last_connection = new Date();
        const updateUser = await UserModel.findByIdAndUpdate(user._id, user);
        res.redirect("/products");
      } else {
        alert("Wrong Credentials");
        res.redirect("/login");
      }
    } else {
      alert("User was not registered");
      res.redirect("/signup");
    }
  } catch (error) {
    res.json({ stats: "errorLogin", message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    let token = req.cookies[options.server.cookieToken];
    passport.authenticate("jwt", { session: false });
    const info = jwt.verify(token, options.server.secretToken);
    const email = info.email;
    const user = await UserManager.getUserByEmail(email);
    if (user) {
      user.last_connection = new Date();
      const updateUser = await UserModel.findByIdAndUpdate(user._id, user);
    } else {
      console.log("No se encontró el usuario");
    }
  } catch (error) {
    res.json({ stats: "errorLogout", message: error.message });
  }
};

export const forgot = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserManager.getUserByEmail(email);
    if (user) {
      console.log("Existe el usuario");
      const token = generateEmailToken(email, 180);
      console.log("General el token: " + token);
      await sendRecoveryPass(email, token);
      res.send(
        "Email was sent to your email account <a href='/login'>To Login</a>"
      );
    } else {
      res.send(
        "Email was not found <a href='/forgot-password'>Go to Reset Password</a>"
      );
    }
  } catch (error) {
    res.send("Error <a href='/forgot-password'>Go to Reset Password</a>");
  }
};

export const reset = async (req, res) => {
  try {
    const token = req.query.token;
    const { email, newPassword } = req.body;
    const validEmail = verifyEmailToken(token);
    if (!validEmail) {
      return res.send(
        `The link is not valid, please generate a new link to recover your password <a href="/forgot-password">Recover Password</a>`
      );
    } else {
      const user = await UserManager.getUserByEmail(email);
      if (!user) {
        req.send("User not registered");
      } else {
        if (isValidPassword(user, newPassword)) {
          return res.send("You can't use the same password");
        }
        const userData = {
          ...user,
          password: createHash(newPassword),
        };
        //const userUpdate = await UserManager.updateUser(
        const userUpdate = await UserModel.findOneAndUpdate(
          { email: email },
          userData
        );
        res.render("login", { message: "Password updated" });
      }
    }
  } catch (error) {
    res.send(error.message);
  }
};
