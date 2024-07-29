import mongoose from "mongoose";
import userStatus from "../Src/utils/user-status.js";
import { systemRoles } from "../Src/utils/systemRoles.js";

//================================================
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    userStatus: {
      type: String,
      enum: [userStatus.ONLINE, userStatus.OFFLINE],
      default: userStatus.OFFLINE,
    },
    userImg: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    mediaFolderId: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: "user",
    },
    code: String,
  },
  { timestamps: true }
);

//================================================
const userModel = mongoose.model("User", userSchema);
export default userModel;
