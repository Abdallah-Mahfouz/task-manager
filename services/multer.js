import multer from "multer";
import { nanoid } from "nanoid";
import { AppError } from "../Src/utils/appError.js";
import path from "path";
import fs from "fs";
//*================================================================
export const validExtension = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  video: ["video/mp4", "video/mkv", "video/avi", "video/mov"],
  pdf: ["application/pdf"],
};
//?==================
export const multerHost = (customValidation = ["image/png"]) => {
  //?==================
  const storage = multer.diskStorage({});
  //?==================
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      cb(new AppError("file not supported"), false);
    }
  };
  //?==================
  const upload = multer({ fileFilter, storage });
  return upload;
};