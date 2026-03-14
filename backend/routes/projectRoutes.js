import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  deleteProject
} from '../controllers/projectController.js';

import validate from '../middleware/validate.js';
import { projectSchema } from '../validations/projectValidation.js';
import taskRouter from './taskRoutes.js';

const router = express.Router();

// Re-route into other resource routers
router.use('/:projectId/tasks', taskRouter);

router
  .route('/')
  .get(getProjects)
  .post(validate(projectSchema), createProject);

router
  .route('/:id')
  .get(getProject)
  .delete(deleteProject);

export default router;
