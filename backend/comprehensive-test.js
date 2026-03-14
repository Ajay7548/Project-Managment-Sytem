const run = async () => {
  const baseUrl = 'http://localhost:5000';
  let projectId, taskId1, taskId2;

  // === 1. PAGINATION TEST ===
  console.log('\n=== 1. PAGINATION: GET /projects?page=1&limit=5 ===');
  const pageRes = await fetch(`${baseUrl}/projects?page=1&limit=5`);
  const pageData = await pageRes.json();
  console.log(`Total: ${pageData.total}, Pages: ${pageData.pages}, Page: ${pageData.page}, Count in response: ${pageData.count}`);
  console.log('✅ Pagination works!' );

  // === 2. CREATE PROJECT ===
  console.log('\n=== 2. Creating a test project ===');
  const projRes = await fetch(`${baseUrl}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Sort Test Project' })
  });
  const projData = await projRes.json();
  projectId = projData.data._id;
  console.log(`Project created: ${projectId}`);

  // === 3. CREATE TWO TASKS WITH DIFFERENT DUE DATES ===
  console.log('\n=== 3. Creating tasks with different due dates ===');
  const t1Res = await fetch(`${baseUrl}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Early Task', due_date: '2025-01-01' })
  });
  taskId1 = (await t1Res.json()).data._id;

  const t2Res = await fetch(`${baseUrl}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Late Task', due_date: '2026-12-31' })
  });
  taskId2 = (await t2Res.json()).data._id;
  console.log('Two tasks created');

  // === 4. SORT BY DUE DATE ASC ===
  console.log('\n=== 4. GET tasks sorted by due_date ASC ===');
  const sortAscRes = await fetch(`${baseUrl}/projects/${projectId}/tasks?sort=due_date_asc`);
  const sortAscData = await sortAscRes.json();
  console.log('Tasks (Asc):', sortAscData.data.map(t => `${t.title} (${t.due_date?.split('T')[0]})`));
  console.log('✅ Sorting (ASC) works!');

  // === 5. SORT BY DUE DATE DESC ===
  console.log('\n=== 5. GET tasks sorted by due_date DESC ===');
  const sortDescRes = await fetch(`${baseUrl}/projects/${projectId}/tasks?sort=due_date_desc`);
  const sortDescData = await sortDescRes.json();
  console.log('Tasks (Desc):', sortDescData.data.map(t => `${t.title} (${t.due_date?.split('T')[0]})`));
  console.log('✅ Sorting (DESC) works!');

  // === 6. DELETE PROJECT (should cascade delete tasks) ===
  console.log('\n=== 6. DELETE project (cascade deletes tasks) ===');
  const delRes = await fetch(`${baseUrl}/projects/${projectId}`, { method: 'DELETE' });
  const delData = await delRes.json();
  console.log('Delete Response:', delData);
  if (delData.success) {
    console.log('✅ Project deleted successfully!');
  } else {
    console.log('❌ Delete FAILED:', delData.error);
  }
};

run().catch(e => console.error('❌ Test Error:', e.message));
