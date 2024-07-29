import Joi from "joi";
import generalFields from "../utils/generalFields.js";

//================================================
//!=========  addTask   =============
export const addTaskValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    textBody: Joi.string().required(),
    listBody: Joi.array().required(),
    accessSpecifier: Joi.string().required(),
    createdBy: generalFields.id.required(),
    categoryId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
  params: Joi.object({
    categoryId: generalFields.id.required(),
  }),
};
//================================================
//!=========  updateTask   =============
export const updateTaskValidation = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  body: Joi.object({
    newTitle: Joi.string(),
    newTextBody: Joi.string(),
    newListBody: Joi.array(),
    newAccessSpecifier: Joi.string(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  deleteTask   =============
export const deleteTaskValidation = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  getAllPublicTasks   =============
export const getAllPublicTasksValidation = {
  query: Joi.object({
    page: Joi.string().required(),
    size: Joi.string().required(),
  }),
};
//================================================
//!=========  getAllPrivateTasks   =============
export const getAllPrivateTasksValidation = {
  headers: generalFields.headers.required(),
};
