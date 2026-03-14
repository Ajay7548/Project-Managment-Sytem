import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Project endpoints
export const fetchProjects = (page = 1, limit = 10) => 
  api.get(`/projects?page=${page}&limit=${limit}`).then(res => res.data);

export const fetchProject = (id) => 
  api.get(`/projects/${id}`).then(res => res.data);

export const createProject = (data) => 
  api.post('/projects', data).then(res => res.data);

export const deleteProject = (id) => 
  api.delete(`/projects/${id}`).then(res => res.data);

// Task endpoints
export const fetchTasks = (projectId, status, sort) => {
  let url = `/projects/${projectId}/tasks?`;
  if (status) url += `status=${status}&`;
  if (sort) url += `sort=${sort}&`;
  return api.get(url).then(res => res.data);
};

export const createTask = (projectId, data) => 
  api.post(`/projects/${projectId}/tasks`, data).then(res => res.data);

export const updateTask = (taskId, data) => 
  api.put(`/tasks/${taskId}`, data).then(res => res.data);

export const deleteTask = (taskId) => 
  api.delete(`/tasks/${taskId}`).then(res => res.data);

export default api;
