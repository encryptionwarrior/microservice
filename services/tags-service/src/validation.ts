import Joi from "joi";

export const createTagSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z0-9\s\-_]+$/)
    .messages({
      "string.min": "Tag name must be at least 1 character long",
      "string.max": "Tag name must not exceed 50 characters",
      "string.pattern.base":
        "Tag name can only contain letters, numbers, spaces, hyphens, and underscores",
      "any.required": "Tag name is required",
    }),
     color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Color must be a valid hex color format (e.g., #FF5733 or #F73)",
    })
});
