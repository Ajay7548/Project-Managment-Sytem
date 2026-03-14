import Joi from 'joi';

export const projectSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Project name is required',
    'string.max': 'Project name cannot exceed 100 characters',
    'any.required': 'Project name is required'
  }),
  description: Joi.string().max(500).allow('', null).messages({
    'string.max': 'Description cannot exceed 500 characters'
  })
});
