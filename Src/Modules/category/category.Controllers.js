import { asyncHandler } from "../../middleware/asyncHandler.js";
import categoryModel from "../../../Models/category.Models.js";
import { AppError } from "../../utils/appError.js";
import taskModel from "../../../Models/task.Models.js";
//================================================
//!=========  addCategory   =============
export const addCategory = asyncHandler(async (req, res, next) => {
  const { categoryType, name } = req.body;
  const userId = req.user._id;

  const isCategoryExist = await categoryModel.findOne({
    categoryType,
    owner: userId,
  });
  if (isCategoryExist) {
    return next(
      new AppError(`Category with type "${categoryType}" already exists`, 409)
    );
  }

  if (!["To Do", "In Progress", "Done"].includes(categoryType)) {
    return next(
      new AppError(
        `Category type should be "To Do", "In Progress" or "Done"`,
        400
      )
    );
  }

  const newCategoryData = { categoryType, name, owner: userId };
  const newCategory = await categoryModel.create(newCategoryData);

  if (!newCategory) {
    return next(new AppError("Failed to create category", 500));
  }

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
});
//================================================1
//!=========  updateCategory   =============

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { newName } = req.body;
  const { id: categoryId } = req.params;
  const userId = req.user._id;

  const category = await categoryModel.findOneAndUpdate(
    { _id: categoryId, owner: userId },
    { name: newName },
    { new: true }
  );

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});
//================================================1
//!=========  deleteCategory   =============
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id: categoryId } = req.params;
  const userId = req.user._id;

  const category = await categoryModel.findOneAndDelete({
    _id: categoryId,
    owner: userId,
  });
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const deleteRelatedTasks = await taskModel.deleteMany({ categoryId });
  if (!deleteRelatedTasks) {
    return next(new AppError("Failed to delete related tasks", 500));
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: category,
  });
});
//================================================1
//!=========  getAllCategories   =============
export const getAllCategories = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const allCategories = await categoryModel.find({ owner: userId });

  if (!allCategories.length) {
    return next(new AppError("No categories found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: allCategories,
  });
});

//================================================1
//!=========  getCategoryByName   =============
export const getCategoryByName = asyncHandler(async (req, res, next) => {
  const { name } = req.query;

  // Check if the name query parameter is provided
  if (!name) {
    return next(new AppError("Category name is required", 400));
  }
  const findCategory = await categoryModel.findOne({
    name,
    owner: req.user._id,
  });
  if (!findCategory) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: findCategory,
  });
});
