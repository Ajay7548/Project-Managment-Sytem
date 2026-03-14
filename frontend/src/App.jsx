import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectsList from './pages/ProjectsList';
import TasksList from './pages/TasksList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-indigo-600"><Link to="/">Mini PM System</Link></h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<ProjectsList />} />
            <Route path="/projects/:id" element={<TasksList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
