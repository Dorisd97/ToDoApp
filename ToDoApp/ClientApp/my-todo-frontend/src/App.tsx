/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// my-todo-frontend/src/TodoApp.tsx

import React, { useState, useEffect } from 'react';

// Updated interface to match the C# model
interface Task {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
}

// The URL of your ASP.NET Core API
const apiUrl = 'https://localhost:7029/api/todo';

const TodoApp = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to load tasks from the backend
    const loadTasks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data: Task[] = await response.json();
            setTasks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Load tasks on initial component mount
    useEffect(() => {
        loadTasks();
    }, []);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) {
            setError('Task cannot be empty');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // The backend expects { title: string, isCompleted: boolean }
                body: JSON.stringify({ title: newTask, isCompleted: false }),
            });

            if (!response.ok) throw new Error('Failed to add task');

            const createdTask: Task = await response.json();
            setTasks([createdTask, ...tasks]);
            setNewTask('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleComplete = async (id: number) => {
        const taskToUpdate = tasks.find(t => t.id === id);
        if (!taskToUpdate) return;

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT', // Use PUT to update an existing resource
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...taskToUpdate, completed: !taskToUpdate.completed }),
            });

            if (!response.ok) throw new Error('Failed to update task');

            setTasks(tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            ));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteTask = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete task');

            setTasks(tasks.filter(task => task.id !== id));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;

    // The rest of your JSX remains the same!
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">To-Do List</h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                        A full-stack web application built with ASP.NET Core and React
                    </p>
                </div>

                {/* ... Your form and task list JSX ... */}
                {/* No changes are needed in the JSX part */}

            </div>
        </div>
    );
};

export default TodoApp;