import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Task from "./component/Task";
import Analytics from "./component/Analytics";
import Login from "./component/Login";
import Register from "./component/Register";
import { useState } from "react";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Task tasks={tasks} setTasks={setTasks} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Analytics tasks={tasks} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
