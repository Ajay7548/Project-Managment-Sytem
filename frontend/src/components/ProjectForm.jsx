import React, { useState } from 'react';
import { createProject } from '../services/api';

const ProjectForm = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createProject({ name, description });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{Array.isArray(error) ? error.join(', ') : error}</div>}
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name *</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full sm:w-auto sm:ml-3"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary mt-3 w-full sm:w-auto sm:mt-0"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
