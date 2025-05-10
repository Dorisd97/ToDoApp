// Fetch all to-dos from the API
async function fetchTodos() {
    const response = await fetch('https://localhost:7029/api/todos');
    const todos = await response.json();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear the existing list

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.title; // Display the title of each to-do
        todoList.appendChild(li);
    });
}

// Add a new to-do
async function addTodo() {
    const todoTitle = document.getElementById('new-todo').value;

    if (!todoTitle) {
        alert('Please enter a to-do');
        return;
    }

    const newTodo = {
        title: todoTitle
    };

    const response = await fetch('https://localhost:7029/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
    });

    if (response.ok) {
        fetchTodos(); // Refresh the list after adding a new to-do
    } else {
        alert('Error adding to-do');
    }

    document.getElementById('new-todo').value = ''; // Clear input field
}

// Fetch todos on page load
window.onload = fetchTodos;
