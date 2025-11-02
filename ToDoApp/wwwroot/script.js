let todos = [];  // Local variable to store to-dos
let editingTodoId = null; // Variable to store ID of the todo being edited

// Fetch all to-dos from the API
async function fetchTodos() {
    const response = await fetch('https://localhost:7029/api/todos');
    todos = await response.json();

    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear the existing list

    todos.forEach(todo => {
        const card = document.createElement('div');
        card.classList.add('todo-card');

        // To-Do title
        const title = document.createElement('h3');
        title.textContent = todo.title;

        // Due date
        const dueDate = document.createElement('p');
        dueDate.classList.add('due-date');
        dueDate.textContent = `Due: ${todo.dueDate}`;

        // Priority tag
        const priority = document.createElement('span');
        priority.classList.add('priority');
        priority.classList.add(`priority-${todo.priority}`);
        priority.textContent = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTodo(todo.id);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        // Append elements to card
        card.appendChild(title);
        card.appendChild(dueDate);
        card.appendChild(priority);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);

        // Append card to the list
        todoList.appendChild(card);
    });

    // Show the To-Do list container
    document.getElementById('todo-list-container').style.display = 'block';
    document.getElementById('todo-form-container').style.display = 'none';
}

// Add a new to-do or edit an existing one
async function saveTodo() {
    const title = document.getElementById('todo-title').value;
    const dueDate = document.getElementById('todo-date').value;
    const priority = document.getElementById('todo-priority').value;
    const description = document.getElementById('todo-description').value;

    if (!title || !dueDate) {
        alert('Please fill in all fields');
        return;
    }

    const todo = {
        title,
        dueDate,
        priority,
        description,
        completed: false
    };

    if (editingTodoId) {
        // Edit the existing to-do
        await fetch(`https://localhost:7029/api/todos/${editingTodoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });
        editingTodoId = null;
    } else {
        // Create a new to-do
        await fetch('https://localhost:7029/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });
    }

    fetchTodos();  // Refresh the list
    document.getElementById('todo-form').reset();  // Clear form
}

// Open the form for adding or editing a to-do
function openTodoForm(todo = null) {
    document.getElementById('todo-form-container').style.display = 'block';
    document.getElementById('todo-list-container').style.display = 'none';

    if (todo) {
        document.getElementById('form-title').textContent = 'Edit To-Do';
        document.getElementById('todo-title').value = todo.title;
        document.getElementById('todo-date').value = todo.dueDate;
        document.getElementById('todo-priority').value = todo.priority;
        document.getElementById('todo-description').value = todo.description;
        editingTodoId = todo.id;  // Store the ID of the todo being edited
    } else {
        document.getElementById('form-title').textContent = 'Add New To-Do';
        document.getElementById('todo-form').reset();  // Reset form for new to-do
    }
}

// Edit an existing to-do
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    openTodoForm(todo);
}

// Delete a to-do
async function deleteTodo(id) {
    const response = await fetch(`https://localhost:7029/api/todos/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchTodos();  // Refresh the list after deletion
    } else {
        alert('Error deleting to-do');
    }
}

// Cancel the edit and close the form
function cancelEdit() {
    document.getElementById('todo-form-container').style.display = 'none';
    document.getElementById('todo-list-container').style.display = 'block';
}

// Initialize the app by fetching all to-dos
window.onload = fetchTodos;
