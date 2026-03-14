import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProject, fetchTasks, deleteTask, updateTask } from '../services/api';
import { ArrowLeft, Plus, CheckCircle2, Clock, Circle, Filter, ArrowUpDown, Trash2, Edit2 } from 'lucide-react';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

const TasksList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Sorts
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('created_at_-1'); // default sort key

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const projData = await fetchProject(id);
      setProject(projData.data);

      const tasksData = await fetchTasks(id, statusFilter, sortOrder);
      setTasks(tasksData.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, statusFilter, sortOrder]);

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onTaskSaved = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
    loadData();
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      await updateTask(task._id, { status: newStatus });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const StatusIcon = ({ status }) => {
    if (status === 'done') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === 'in-progress') return <Clock className="h-5 w-5 text-yellow-500" />;
    return <Circle className="h-5 w-5 text-gray-300" />;
  };

  if (loading && !project) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project?.name}</h2>
            <p className="text-gray-500 mt-1 max-w-3xl">{project?.description}</p>
          </div>
          <button onClick={openCreateModal} className="btn btn-primary mt-4 sm:mt-0 self-start">
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gray-400 mr-2" />
          <select 
            className="input-field py-1.5 text-sm m-0 border-gray-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        
        <div className="flex items-center w-full sm:w-auto">
          <ArrowUpDown className="h-4 w-4 text-gray-400 mr-2" />
          <select 
            className="input-field py-1.5 text-sm m-0 border-gray-300"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="created_at_-1">Newest First</option>
            <option value="due_date_asc">Due Date (Earliest)</option>
            <option value="due_date_desc">Due Date (Latest)</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <li className="p-10 text-center text-gray-500">No tasks found.</li>
          ) : (
            tasks.map(task => (
              <li key={task._id} className="hover:bg-gray-50 transition-colors">
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <button onClick={() => handleStatusToggle(task)} className="mr-3 flex-shrink-0 focus:outline-none">
                      <StatusIcon status={task.status} />
                    </button>
                    <div className="min-w-0 flex-1 px-4 cursor-pointer" onClick={() => openEditModal(task)}>
                      <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-indigo-600'}`}>
                        {task.title}
                      </p>
                      <p className="mt-1 flex items-center text-sm text-gray-500 truncate">
                        {task.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    {task.due_date && (
                      <div className="text-xs text-gray-500 hidden sm:block whitespace-nowrap">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex space-x-2">
                       <button onClick={() => openEditModal(task)} className="text-gray-400 hover:text-blue-500">
                        <Edit2 className="h-4 w-4" />
                       </button>
                       <button onClick={() => handleDeleteTask(task._id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={taskToEdit ? "Edit Task" : "Create New Task"}>
        <TaskForm projectId={id} taskToEdit={taskToEdit} onSuccess={onTaskSaved} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default TasksList;
