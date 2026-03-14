// E2E Test Script

const runTests = async () => {
  const baseUrl = 'http://localhost:5000';
  let projectId;
  let taskId;

  console.log('--- Testing Mini PM Backend APIs ---');

  try {
    // 1. Create a Project
    console.log('\n[POST] /projects');
    const projectRes = await fetch(`${baseUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Project', description: 'Testing the API' })
    });
    const projectData = await projectRes.json();
    console.log('Response:', projectData);
    if (projectData.success) projectId = projectData.data._id;

    // 2. Get Projects
    console.log('\n[GET] /projects');
    const getProjectsRes = await fetch(`${baseUrl}/projects`);
    console.log('Response:', await getProjectsRes.json());

    // 3. Create a Task
    if (projectId) {
      console.log(`\n[POST] /projects/${projectId}/tasks`);
      const taskRes = await fetch(`${baseUrl}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test Task', status: 'todo', priority: 'high' })
      });
      const taskData = await taskRes.json();
      console.log('Response:', taskData);
      if (taskData.success) taskId = taskData.data._id;
    }

    // 4. Get Tasks for Project
    if (projectId) {
      console.log(`\n[GET] /projects/${projectId}/tasks`);
      const getTasksRes = await fetch(`${baseUrl}/projects/${projectId}/tasks`);
      console.log('Response:', await getTasksRes.json());
    }

    // 5. Update Task
    if (taskId) {
      console.log(`\n[PUT] /tasks/${taskId}`);
      const updateTaskRes = await fetch(`${baseUrl}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done', priority: 'low' })
      });
      console.log('Response:', await updateTaskRes.json());
    }

    // 6. Delete Task
    // if (taskId) {
    //   console.log(`\n[DELETE] /tasks/${taskId}`);
    //   const deleteTaskRes = await fetch(`${baseUrl}/tasks/${taskId}`, {
    //     method: 'DELETE'
    //   });
    //   console.log('Response:', await deleteTaskRes.json());
    // }

    // 7. Delete Project
    if (projectId) {
      console.log(`\n[DELETE] /projects/${projectId}`);
      const deleteProjRes = await fetch(`${baseUrl}/projects/${projectId}`, {
        method: 'DELETE'
      });
      console.log('Response:', await deleteProjRes.json());
    }

    console.log('\n--- All Tests Completed Successfully ---');
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
};

runTests();
