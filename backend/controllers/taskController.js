import Task from '../models/Task.js';
import Project from '../models/Project.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Get tasks for a project (with filtering by status and sorting by due_date)
// @route   GET /projects/:projectId/tasks
// @access  Public
export const getTasks = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { status, sort } = req.query;

  let query = { project_id: projectId };

  // Apply filter by status if provided
  if (status) {
    query.status = status;
  }

  // Determine sort order
  let sortObj = { created_at: -1 }; // default sort
  if (sort === 'due_date_asc') {
    sortObj = { due_date: 1 };
  } else if (sort === 'due_date_desc') {
    sortObj = { due_date: -1 };
  }

  const tasks = await Task.find(query).sort(sortObj);

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Create new task
// @route   POST /projects/:projectId/tasks
// @access  Public
export const createTask = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${projectId}`, 404));
  }

  // Add project_id to request body
  const taskData = { ...req.body, project_id: projectId };

  const task = await Task.create(taskData);
  
  res.status(201).json({ success: true, data: task });
});

// @desc    Update task
// @route   PUT /tasks/:id
// @access  Public
export const updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Delete task
// @route   DELETE /tasks/:id
// @access  Public
export const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  await Task.deleteOne({ _id: req.params.id });

  res.status(200).json({ success: true, data: {} });
});
