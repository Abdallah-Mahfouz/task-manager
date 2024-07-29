import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectionDB from "./DB/connectionDB.js";
import categoryRouter from "./Src/Modules/category/category.Routes.js";
import userRouter from "./Src/Modules/user/user.Routes.js";
import taskRouter from "./Src/Modules/task/task.Routes.js";
import { AppError } from "./Src/utils/appError.js";
import { globalError } from "./Src/utils/globalError.js";
//?================================================
const app = express();
const port = process.env.PORT || 3001;
//?===================
connectionDB();
//?===================
app.use(express.json());
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/task", taskRouter);
//?===================
//! error route handler
app.use("*", (req, res, next) =>
  next(new AppError(`invalid route${req.originalUrl}`, 404))
);
//?===================
//! global error handler middleware
app.use(globalError);
//?================================================================
app.listen(port, () => console.log(`app listening on port ${port}!`));
