import React, { useState } from "react";
import axios from "axios";

const Chatbox = () => {
  const [tasks, setTasks] = useState([
    { title: "Complete project report", deadline: "2025-01-20", type: "Work" },
    { title: "Buy groceries", deadline: "2025-01-18", type: "Personal" },
  ]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const fetchPrioritization = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/prioritize", {
        tasks,
        prompt: input || "",
      });
      const aiMessage = response.data.response;
      setMessages((prev) => [...prev, { sender: "ai", text: aiMessage }]);
    } catch (error) {
      console.error("Error fetching prioritization:", error.message);
      setMessages((prev) => [...prev, { sender: "ai", text: "Error fetching prioritization!" }]);
    }
  };
  
  

  return (
    <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg rounded-lg border border-gray-300">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">AI Chatbox</h2>
        <div className="messages h-48 overflow-y-auto bg-gray-100 p-2 rounded-md">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet!</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md mb-2 ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex items-center border-t border-gray-300 p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchPrioritization}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
