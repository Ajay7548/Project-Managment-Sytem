import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

import validate from '../middleware/validate.js';
import { taskSchema } from '../validations/taskValidation.js';

// We use mergeParams because we are nesting this router inside projectRoutes
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getTasks)
  .post(validate(taskSchema), createTask);

router
  .route('/:id')
  .put(validate(taskSchema), updateTask)
  .delete(deleteTask);

export default router;
