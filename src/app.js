import express from "express";
import { engine } from "express-handlebars";
import { options } from "./config/options.js";
import { __dirname } from "./utils.js";
import { addLogger } from "./utils/logger.js";
import path from "path";
// ROUTES
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import authRouter from "./routes/auth.routes.js";
import messagesRouter from "./routes/message.routes.js";
import usersRouter from "./routes/users.routes.js";
import ticketsRouter from "./routes/ticket.routes.js";
// DATABASE
import { ConnectionDb } from "./config/dbConnection.js";
import { Server } from "socket.io";
import { MessageManager, MessageModel } from "../src/dao/factory.js";
import passport from "passport";
import { initializedPassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { checkRole } from "./middlewares/auth.js";
import { swaggerSpecs } from "./config/docConfig.js";
import swaggerUi from "swagger-ui-express";

// SERVICE
const messages = [];
const messageManager = new MessageManager(MessageModel);

// SERVER
const port = options.server.port;
const app = express();
const httpServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Logging
app.use(addLogger);

// Only One Mongo Connection
const dbInstance = ConnectionDb.getInstance();

// SOCKET SERVER
const socketServer = new Server(httpServer);

// Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/../public")));
app.use(cookieParser());

httpServer.on("error", (error) => console.log(`Error in server ${error}`));

// Config PASSPORT
initializedPassport();
app.use(passport.initialize());

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Routers
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", checkRole(["user"]), messagesRouter);
app.use("/api/sessions", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/tickets", ticketsRouter);

// Definir donde podremos ver la documentación
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/niveles", (req, res) => {
  req.logger.silly("Nivel Silly");
  req.logger.verbose("Nivel Verbose");
  req.logger.debug("Nivel Debug");
  req.logger.http("Nivel Http");
  req.logger.info("Nivel Info");
  req.logger.warn("Nivel Warn");
  req.logger.error("Nivel Error");
  res.send("Prueba Niveles");
});

// SOCKET SERVER CONFIG
socketServer.on("connection", (socket) => {
  console.log(`New client connected! ${socket.id}`);

  socket.on("message", (data) => {
    socket.emit("input-changed", JSON.stringify(data));
  });

  socket.on("chat-message", async (data) => {
    //messages.push(data);
    const user = data.user;
    const message = data.message;
    const result = await messageManager.create(user, message);
    socket.emit("messages", result);
  });

  socket.on("new-user", (username) => {
    socket.emit("messages", messages);
    socket.broadcast.emit("new-user", username);
  });

  socket.on("input-changed", (data) => {
    socketServer.emit("input-changed", data);
  });

  socket.on("new-message", (data) => {
    messages.push({ socketId: socket.id, mensaje: data });
    socketServer.emit("input-changed", JSON.stringify(messages));
  });
});

/*
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
*/

// mongoose.connect(connectionString).then((conn) => {
//   console.log("Connected To DB!");
// });
