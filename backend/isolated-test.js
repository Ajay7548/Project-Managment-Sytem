const run = async () => {
  const baseUrl = 'http://localhost:5000';
  console.log('--- Creating Project ---');
  const projectRes = await fetch(`${baseUrl}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Delete Me Project' })
  });
  const projectData = await projectRes.json();
  const projectId = projectData.data._id;
  console.log('Project ID:', projectId);

  console.log('--- Creating Task ---');
  await fetch(`${baseUrl}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Task to be deleted' })
  });

  console.log('--- Deleting Project ---');
  const delRes = await fetch(`${baseUrl}/projects/${projectId}`, { method: 'DELETE' });
  console.log('Delete Response:', await delRes.json());
}
run();
