import React, { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/api';

const TaskForm = ({ projectId, taskToEdit, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || 'medium');
      if (taskToEdit.due_date) {
        setDueDate(new Date(taskToEdit.due_date).toISOString().split('T')[0]);
      }
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const taskData = {
        title,
        description,
        status,
        priority,
        due_date: dueDate || null
      };

      if (taskToEdit) {
        await updateTask(taskToEdit._id, taskData);
      } else {
        await createTask(projectId, taskData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{Array.isArray(error) ? error.join(', ') : error}</div>}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Task Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field mt-1"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field mt-1"
          rows="3"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="input-field mt-1">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field mt-1">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input-field mt-1"
        />
      </div>

      <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
        <button type="submit" disabled={loading} className="btn w-full sm:w-auto sm:ml-3 bg-blue-600 focus:ring-blue-500 text-white hover:bg-blue-700">
          {loading ? 'Saving...' : taskToEdit ? 'Update Task' : 'Create Task'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary mt-3 w-full sm:w-auto sm:mt-0">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
