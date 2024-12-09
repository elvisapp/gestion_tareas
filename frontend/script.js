document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');

  const fetchTasks = () => {
    fetch('http://localhost:4000/tasks')
      .then(response => response.json())
      .then(tasks => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${task.title}</span>
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <button data-id="${task.id}">Eliminar</button>
          `;
          taskList.appendChild(li);
        });
      });
  };

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then(() => {
      taskForm.reset();
      fetchTasks();
    });
  });

  taskList.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    if (e.target.tagName === 'BUTTON') {
      fetch(`http://localhost:4000/tasks/${id}`, { method: 'DELETE' }).then(fetchTasks);
    } else if (e.target.tagName === 'INPUT') {
      const completed = e.target.checked;
      fetch(`http://localhost:4000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      }).then(fetchTasks);
    }
  });

  fetchTasks();
});
