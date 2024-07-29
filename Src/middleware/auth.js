import { AppError } from "../utils/appError.js";
import jwt from "jsonwebtoken";
import userModel from "../../Models/user.Models.js";
import { asyncHandler } from "./asyncHandler.js";
//================================================

export const auth = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return next(new AppError("Token does not exist", 400));
    }

    // Ensure token starts with the specified prefix for added security
    if (!token.startsWith("abdo_")) {
      return next(new AppError("Invalid token", 400));
    }

    const newToken = token.split("abdo_")[1];
    if (!newToken) {
      return next(new AppError("Invalid token", 400));
    }

    // Verify token
    const decoded = jwt.verify(newToken, process.env.JWT_SECRET || "abdo");
    if (!decoded?.userId) {
      return next(new AppError("Invalid token", 400));
    }

    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Authorization check
    if (!roles.includes(user.role)) {
      return next(new AppError("You do not have permission", 401));
    }

    req.user = user;
    next();
  });
};
