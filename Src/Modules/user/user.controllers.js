import dotenv from "dotenv";
dotenv.config();
import userModel from "../../../Models/user.Models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/sendEmail.js";
import { AppError } from "../../utils/appError.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import cloudinary from "../../utils/cloudinary.js";
import { customAlphabet } from "nanoid";

//================================================
//!=========    SIGNUP     =============
export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, username, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }

  // Upload user image to cloudinary if exists
  let userImg = {};
  if (req.file) {
    const data = await cloudinary.uploader.upload(req.file.path);
    userImg = {
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  }

  const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  const user = await userModel.create({
    firstName,
    lastName,
    username,
    email,
    password: hash,
    userImg,
    role,
  });

  const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/verifyEmail/${verificationToken}`;
  const message = `Please verify your email by clicking on the following link: ${verificationUrl}`;

  const emailSent = await sendEmail(user.email, "Email Verification", message);
  if (!emailSent) {
    return next(new AppError("Failed to send verification email", 500));
  }

  return res.status(201).json({
    msg: "success",
    user,
  });
});
//================================================
//!=========    VERIFY     =============

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findByIdAndUpdate(
    decoded.id,
    { isEmailVerified: true },
    { new: true }
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    msg: "success",
    message: "Email verified successfully",
  });
});
//================================================
//!=========    SIGNIN     =============
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid credentials", 401));
  }

  user.userStatus = "online";
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    msg: "success",
    token,
  });
});

//================================================
//!=========    ALL USERS     =============
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({
    msg: "success",
    data: users,
  });
});
//================================================
//!=========    UPDATE ACCOUNT     =============
export const updateAccount = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;
  const userId = req.user._id;

  // If password is provided, hash it before updating
  if (password) {
    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.SALT_ROUNDS
    );
    req.body.password = hashedPassword;
  }

  // If a new image is provided, upload it to Cloudinary
  if (req.file) {
    const data = await cloudinary.v2.uploader.upload(req.file.path);
    req.body.userImg = {
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  }

  // Update the user in the database
  const user = await userModel.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    msg: "success",
    data: user,
  });
});
//================================================
//!=========    DELETE ACCOUNT     =============
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const deleteUser = await userModel.findByIdAndDelete(userId);

  res.status(200).json({ msg: "User deleted successfully", deleteUser });
});
//================================================
//!=========  FORGET PASSWORD   =============
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  //================
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  //================
  const code = customAlphabet("1234567890", 5);
  const newCode = code();
  //================
  // to send email
  const checkSendEmail = await sendEmail(
    email,
    "Code for Resetting Your Password",
    `<h1>Your code is ${newCode}</h1>`
  );
  if (!checkSendEmail) {
    return next(new AppError("email not sent", 400));
  }
  //================
  await userModel.updateOne(
    { email },
    { code: newCode }
  );
  //================
  res.status(200).json({ msg: "success" });
});
//================================================================
//!=========  RESET PASSWORD   =============
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;

  //================
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  //================
  if (code !== user.code) {
    return next(new AppError("code not correct", 400));
  }
  //================
  const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  //================
  await userModel.updateOne(
    { email },
    {
      code: "",
      password: hash,
    },
    { new: true }
  );
  //================
  res.status(200).json({ msg: "success" });
});
