import express from "express";
import * as CC from "./category.Controllers.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as MV from "../../validation/category.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

//================================================
const router = express.Router();
//================================================
router.post(
  "/",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.createCategoryValidation),
  CC.addCategory
);
router.put(
  "/:id",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.updateCategoryValidation),
  CC.updateCategory
);
router.delete(
  "/:id",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.deleteCategoryValidation),
  CC.deleteCategory
);
router.get(
  "/",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.getAllCategoriesValidation),
  CC.getAllCategories
);
router.get(
  "/name",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.getCategoryByNameValidation),
  CC.getCategoryByName
);

//================================================
export default router;
