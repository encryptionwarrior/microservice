import joi from "joi";

export const registerSchema = joi.object({
  email: joi
    .string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: joi.string()
     .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
    .min(8).required().messages({
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
    }),
});

export const loginSchema = joi.object({
  email: joi
    .string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: joi.string().required().messages({
      "any.required": "Password is required",
    }),
});


export const refreshTokenSchema = joi.object({
  refreshToken: joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});