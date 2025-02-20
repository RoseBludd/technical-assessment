import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import TasksController from "./controllers/tasks.controller";
import UsersController from "./controllers/users.controller";
import AuthController from "./controllers/auth.controller";
import { authenticateRequest } from "./middleware/authenticate.middleware";
import { errorHandler } from "./middleware/error.middleware";
import swagger from "./swagger";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/tasks", authenticateRequest(), TasksController);
app.use("/users", authenticateRequest(), UsersController);
app.use("/auth", AuthController);
app.use(errorHandler);

swagger(app);

export default app;
