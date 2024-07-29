import Joi from "joi";
import generalFields from "../utils/generalFields.js";
//================================================
//!=========  signUp   =============
export const signupValidation = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    role: Joi.string(),
  }),
};
//================================================
//!=========  signIn   =============
export const signInValidation = {
  body: Joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }),
};
//================================================
//!=========  getAccount   =============
export const getAllUsersValidation = {
  headers: generalFields.headers.required(),
};

//================================================
//!=========  updateAccount   =============
export const updateAccountValidation = {
  body: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    username: Joi.string(),
    email: generalFields.email,
    password: generalFields.password,
  }),
  Headers: generalFields.headers.required(),
} 
//================================================
//!=========  deleteAccount   =============
export const deleteAccountValidation = {
  headers: generalFields.headers.required(),
}