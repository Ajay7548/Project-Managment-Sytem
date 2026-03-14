# Mini Project Management System

A full-stack project management application built with a **Node.js/Express (MVC)** backend and a **React/Vite (Tailwind CSS)** frontend. It uses **MongoDB** as its database.

## Features
- **Projects**: Create, list, view, and delete projects (with cascading deletion of tasks).
- **Tasks**: Add, edit, filter (by status), sort (by due date), and delete tasks associated with a project.
- **RESTful APIs**: Properly structured MVC pattern with validations.
- **Modern UI**: Designed with Tailwind CSS featuring a clean layout, glassmorphism hints, and responsive design.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on default `127.0.0.1:27017` or configurable via `.env`)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (development mode):
   ```bash
   npm run dev
   ```
   > The server will start on `http://localhost:5000`

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   > The React app will run at `http://localhost:5173`

---

## API Documentation

A Postman collection is included in the root directory: `Postman_Collection.json`.
You can import this directly into Postman to test all endpoints.

### Project APIs
- `GET /projects?page=1&limit=10` - Get paginated projects
- `GET /projects/:id` - Get a specific project
- `POST /projects` - Create a new project (Body: `name`, `description`)
- `DELETE /projects/:id` - Delete a project and its tasks

### Task APIs
- `GET /projects/:project_id/tasks?status=todo&sort=due_date_asc` - Get tasks for a project
- `POST /projects/:project_id/tasks` - Create a task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
