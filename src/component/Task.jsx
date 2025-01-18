import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import api from './api';  // Import the Axios instance
import Chatbox from './Chatbox';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', deadline: '', type: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask.title.trim() === '' || newTask.deadline === '' || newTask.type.trim() === '') return;

    try {
      const response = await api.post('/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', deadline: '', type: '' });
      showMessage('Task added successfully!');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task._id === id);
    if (!taskToEdit) {
      console.error("Task not found!");
      return;
    }
    setNewTask({
      title: taskToEdit.title,
      deadline: new Date(taskToEdit.deadline).toISOString().split('T')[0], // Format the date
      type: taskToEdit.type,
    });
    setEditingTask(id);
  };
  

  const saveTask = async () => {
    if (!editingTask) return;

    try {
      await api.put(`/tasks/${editingTask}`, newTask);
      setTasks(tasks.map(task => task._id === editingTask ? { ...task, ...newTask } : task));
      setNewTask({ title: '', deadline: '', type: '' });
      setEditingTask(null);
      showMessage('Task updated successfully!');
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      showMessage('Task deleted successfully!');
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskCompletion = async (id) => {
    const task = tasks.find(task => task._id === id);
    if (!task) return;
  
    try {
      await api.put(`/tasks/${id}`, {
        title: task.title,
        deadline: task.deadline,
        type: task.type,
        completed: !task.completed,
      });
      setTasks(tasks.map(task => task._id === id ? { ...task, completed: !task.completed } : task));
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };
  

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Task List</h1>
        {message && (
          <div className="text-center mb-4">
            <p className="text-green-600 font-semibold">{message}</p>
          </div>
        )}
        <div className="text-center mb-4">
          <Link to="/analytics" className="text-blue-500 hover:underline">View Analytics</Link>
        </div>

        <div className="mb-6 flex items-center">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task Title"
            className="flex-grow p-3 border rounded-l-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            placeholder="Deadline"
            className="flex-grow p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
            className="flex-grow p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Task Type</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>
          {editingTask ? (
            <button
              onClick={saveTask}
              className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600"
            >
              Save
            </button>
          ) : (
            <button
              onClick={addTask}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Add Task
            </button>
          )}
        </div>

        <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div
              key={task._id}
              className="p-4 bg-white rounded-lg shadow-md border"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task._id)}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <div>
                    <span className={`block text-lg font-semibold text-gray-700 ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </span>
                    <span className="block text-sm text-gray-500">Type: {task.type || 'N/A'}</span>
                    <span className="block text-sm text-gray-500">
                      Deadline: {new Date(task.deadline).toISOString().split('T')[0] || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => editTask(task._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tasks added yet!</p>
        )}
      </div>


        <Chatbox />
      </div>
    </div>
  );
};

export default Task;
