import Joi from "joi";

export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must not exceed 200 characters",
    "any.required": "Title is required",
  }),
  content: Joi.string().min(1).max(50000).required().messages({
    "string.min": "Content must be at least 1 character long",
    "string.max": "COntent must not exceed 50,000 characters",
    "any.required": "Content is required",
  }),
  tagIds: Joi.array().items(Joi.string().uuid()).optional().messages({
    "array.base": "Tag IDs must be an array",
    "string.uuid": "Each tag ID must be a valid UUID"
  }),
});
