import { Joi } from "../middlewares/validator";

export const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  displayName: Joi.string().max(30).optional(),
  bio: Joi.string().max(150).optional(),
});
