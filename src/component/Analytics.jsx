import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api'; // Import the Axios instance

const Analytics = () => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/tasks'); // Assuming the endpoint returns all tasks
        const tasks = response.data;

        setTotalTasks(tasks.length);
        setCompletedTasks(tasks.filter(task => task.completed).length);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const completionPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Loading Analytics...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Task Analytics</h1>
        <div className="text-center mb-4">
          <Link to="/" className="text-blue-500 hover:underline">Back to Task List</Link>
        </div>
        <div className="text-center">
          <p className="text-gray-700 text-lg">Total Tasks: {totalTasks}</p>
          <p className="text-gray-700 text-lg">Completed Tasks: {completedTasks}</p>
          <p className="text-blue-600 text-xl font-bold">Completion Percentage: {completionPercentage}%</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
