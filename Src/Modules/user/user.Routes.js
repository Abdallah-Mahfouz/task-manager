import express from "express";
import * as UC from "../user/user.controllers.js";
import * as UV from "../../validation/user.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { multerHost, validExtension } from "../../../services/multer.js";
//================================================

const router = express.Router();

//================================================
router.post(
  "/signup",
  multerHost(validExtension.image).single("image"),
  validation(UV.signupValidation),
  UC.signUp
);
router.get("/verifyEmail/:token", UC.verifyEmail);
router.post("/signin", validation(UV.signInValidation), UC.signIn);
router.get(
  "/",
  auth([systemRoles.admin]),
  validation(UV.getAllUsersValidation),
  UC.getAllUsers
);
router.put(
  "/updateAccount",
  auth([systemRoles.admin, systemRoles.user]),
  multerHost(validExtension.image).single("image"),
  validation(UV.updateAccountValidation),
  UC.updateAccount
);
router.delete(
  "/deleteAccount",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.deleteAccountValidation),
  UC.deleteAccount
);
router.put(
  "/sendCode",
  auth([systemRoles.admin, systemRoles.user]),
  UC.forgetPassword
);
router.put(
  "/resetPassword",
  auth([systemRoles.admin, systemRoles.user]),
  UC.resetPassword
);

//================================================
export default router;
