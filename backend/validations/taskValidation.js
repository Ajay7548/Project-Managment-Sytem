import Joi from 'joi';

export const taskSchema = Joi.object({
  title: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Task title is required',
    'string.max': 'Task title cannot exceed 100 characters',
    'any.required': 'Task title is required'
  }),
  description: Joi.string().max(500).allow('', null).messages({
    'string.max': 'Description cannot exceed 500 characters'
  }),
  status: Joi.string().valid('todo', 'in-progress', 'done').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  due_date: Joi.date().iso().allow('', null).messages({
    'date.format': 'Due date must be a valid ISO date'
  })
});
