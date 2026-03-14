import React, { useEffect, useState } from 'react';
import { fetchProjects, deleteProject } from '../services/api';
import { Link } from 'react-router-dom';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProjects = async (p = page) => {
    setLoading(true);
    try {
      const data = await fetchProjects(p, 6);
      setProjects(data.data);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? All tasks will be lost.')) {
      try {
        await deleteProject(id);
        loadProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onProjectCreated = () => {
    setIsModalOpen(false);
    loadProjects(1); // reload first page on new project
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Projects Dashboard</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow border border-gray-200">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {projects.map((project) => (
              <div key={project._id} className="card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 truncate"><Link to={`/projects/${project._id}`} className="hover:text-blue-600 transition-colors">{project.name}</Link></h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{project.description || 'No description provided.'}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">{new Date(project.created_at).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <Link to={`/projects/${project._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</Link>
                    <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button 
                className="btn btn-secondary px-3 py-1 text-xs" 
                disabled={page <= 1} 
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button 
                className="btn btn-secondary px-3 py-1 text-xs" 
                disabled={page >= totalPages} 
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <ProjectForm onSuccess={onProjectCreated} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ProjectsList;
