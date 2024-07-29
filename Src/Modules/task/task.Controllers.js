import { asyncHandler } from "../../middleware/asyncHandler.js";
import taskModel from "../../../Models/task.Models.js";
import { AppError } from "../../utils/appError.js";

//================================================
//!=========  addTask   =============

export const addTask = asyncHandler(async (req, res, next) => {
  const { title, textBody, listBody, accessSpecifier } = req.body;

  const { categoryId } = req.params;

  const userId = req.user._id;

  const newTaskData = await taskModel.create({
    title,
    textBody,
    listBody,
    accessSpecifier,
    createdBy: userId,
    categoryId,
  });

  const newTask = await taskModel.create(newTaskData);
  if (!newTask) {
    return next(new Error("Failed to create task", { cause: 500 }));
  }

  res.status(201).json({
    msg: "success",
    data: newTask,
  });
});
//================================================
//!=========  getAllPublicTasks   =============
const paginationFunction = ({ page = 1, size = 10 }) => {
  const limit = parseInt(size, 10);
  const skip = (parseInt(page, 10) - 1) * limit;
  return { limit, skip };
};

export const getAllPublicTasks = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, skip } = paginationFunction({ page, size });

  // Get all public tasks from DB using pagination
  const publicTasks = await taskModel
    .find({ accessSpecifier: "public" })
    .limit(limit)
    .skip(skip);

  // Check if there are no tasks in DB
  if (!publicTasks.length) {
    return next(new AppError("No tasks found", 404));
  }

  // Return the response
  res.status(200).json({
    success: true,
    msg: "Tasks fetched successfully",
    data: publicTasks,
  });
});
//================================================
//!========= getPrivateTasks =============
export const getPrivateTasks = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const privateTasks = await taskModel.find({
    accessSpecifier: "private",
    createdBy: userId,
  });
  // 3 - check if there is no tasks
  if (!privateTasks.length) {
    return next(new Error("No tasks found", { cause: 404 }));
  }
  // 4 - return the response
  res.status(200).json({
    success: true,
    message: "tasks fetched successfully",
    data: privateTasks,
  });
});
//================================================
//!=========   updateTask =============
export const updateTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { newTitle, newTextBody, newListBody, newAccessSpecifier } = req.body;
  const updatedTask = await taskModel.findOneAndUpdate(
    { _id: id, createdBy: userId },
    {
      $set: {
        title: newTitle,
        textBody: newTextBody,
        listBody: newListBody,
        accessSpecifier: newAccessSpecifier,
      },
    },
    { new: true }
  );
  if (!updatedTask) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json({
    msg: "task updated successfully",
    data: updatedTask,
  });
});
//================================================
//!========= deleteTask =============
export const deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const deletedTask = await taskModel.findByIdAndDelete({
    _id: id,
    createdBy: userId,
  });
  if (!deletedTask) {
    return next(new AppError("Task not found", 404));
  }

  // Return a successful response with the deleted task data
  res.status(200).json({
    msg: "Task deleted successfully",
    data: deletedTask,
  });
});
