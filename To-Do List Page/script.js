document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskDateInput = document.getElementById('task-date');
    const taskText = taskInput.value.trim();
    const taskDate = taskDateInput.value;

    if (taskText !== '' && taskDate !== '') {
        const task = {
            id: Date.now(),
            text: taskText,
            date: taskDate,
            completed: false
        };
        saveTask(task);
        renderTask(task);
        taskInput.value = '';
        taskDateInput.value = '';
    }
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
}

function renderTask(task) {
    const taskList = task.completed ? document.getElementById('completed-task-list') : document.getElementById('task-list');
    const newTask = document.createElement('li');
    newTask.setAttribute('data-id', task.id);
    
    newTask.innerHTML = `
        <span>${task.text} - ${new Date(task.date).toLocaleString()}</span>
        <button class="edit" onclick="editTask(this)">Edit</button>
        <button class="delete" onclick="deleteTask(this)">Delete</button>
        <button class="complete" onclick="completeTask(this)">${task.completed ? 'Undo' : 'Complete'}</button>
    `;
    
    taskList.appendChild(newTask);
}

function deleteTask(taskButton) {
    const taskItem = taskButton.parentNode;
    const taskId = taskItem.getAttribute('data-id');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskItem.parentNode.removeChild(taskItem);
}

function editTask(taskButton) {
    const taskItem = taskButton.parentNode;
    const taskSpan = taskItem.querySelector('span');
    const taskId = taskItem.getAttribute('data-id');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === parseInt(taskId));
    
    const newTaskText = prompt("Edit your task", task.text);
    const newTaskDate = prompt("Edit the date and time (YYYY-MM-DDTHH:MM)", task.date);

    if (newTaskText && newTaskDate) {
        task.text = newTaskText;
        task.date = newTaskDate;
        taskSpan.textContent = `${newTaskText} - ${new Date(newTaskDate).toLocaleString()}`;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function completeTask(taskButton) {
    const taskItem = taskButton.parentNode;
    const taskId = taskItem.getAttribute('data-id');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === parseInt(taskId));
    
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskItem.parentNode.removeChild(taskItem);
    renderTask(task);
}
