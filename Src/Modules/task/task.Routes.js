import express from "express";
import * as NC from "./task.Controllers.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as MV from "../../validation/task.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

//================================================
const router = express.Router();

//================================================
router.post(
  "/:categoryId",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.addTaskValidation),
  NC.addTask
);

router.get(
  "/public",
  validation(MV.getAllPublicTasksValidation),
  NC.getAllPublicTasks
);
router.get(
  "/private",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.getAllPrivateTasksValidation),
  NC.getPrivateTasks
);
router.put(
  "/:id",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.updateTaskValidation),
  NC.updateTask
);
router.delete(
  "/:id",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.deleteTaskValidation),
  NC.deleteTask
);
//================================================
export default router;
