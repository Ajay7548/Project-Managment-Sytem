import Project from '../models/Project.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Get all projects (with pagination)
// @route   GET /projects
// @access  Public
export const getProjects = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const projects = await Project.find()
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });
  
  const total = await Project.countDocuments();

  res.status(200).json({
    success: true,
    count: projects.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: projects
  });
});

// @desc    Get single project
// @route   GET /projects/:id
// @access  Public
export const getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: project });
});

// @desc    Create new project
// @route   POST /projects
// @access  Public
export const createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

// @desc    Delete project
// @route   DELETE /projects/:id
// @access  Public
export const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  await Project.deleteOne({ _id: req.params.id });
  
  res.status(200).json({ success: true, data: {} });
});
