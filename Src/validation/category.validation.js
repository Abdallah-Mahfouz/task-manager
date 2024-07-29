import Joi from "joi";
import generalFields from "../utils/generalFields.js";

//================================================
//!=========  createCategory   =============
export const createCategoryValidation = {
  body: Joi.object({
    categoryType: Joi.string().required(),
    name: Joi.string().required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  updateCategory   =============
export const updateCategoryValidation = {
  params: Joi.object({
    categoryId: generalFields.id.required(),
  }),
  body: Joi.object({
    newName: Joi.string().required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  deleteCategory   =============
export const deleteCategoryValidation = {
  params: Joi.object({
    categoryId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
}
//================================================
//!=========  getAllCategories   =============
export const getAllCategoriesValidation = {
  headers: generalFields.headers.required(),
}
//================================================
//!=========  getCategoryByName   =============
export const getCategoryByNameValidation = {
  query: Joi.object({
    name: Joi.string().required(),
  }),
  headers: generalFields.headers.required(),
}