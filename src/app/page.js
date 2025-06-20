"use client";

import { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaPlusCircle,
  FaCheckCircle,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";

const priorities = ["Low", "Medium", "High"];
const categories = ["Personal", "Work", "College"];

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);
    setDarkMode(localStorage.getItem("darkMode") === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        text: newTask,
        id: Date.now(),
        completed: false,
        dueDate,
        priority,
        category,
      };
      setTasks([...tasks, task]);
      setNewTask("");
      setDueDate(null);
      setPriority("Medium");
      setCategory("Personal");
    }
  };

  const updateTask = () => {
    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, text: newTask, dueDate, priority, category }
            : task
        )
      );
      setEditingTask(null);
      setNewTask("");
      setDueDate(null);
      setPriority("Medium");
      setCategory("Personal");
    }
  };

  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setNewTask(task.text);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setPriority(task.priority || "Medium");
    setCategory(task.category || "Personal");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [item] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, item);
    setTasks(reordered);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      {/* Beautified background gradient blob */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-900 via-black to-gray-900 opacity-80 blur-2xl" />

      <div
        className="w-full max-w-4xl rounded-2xl shadow-2xl p-6 backdrop-blur-xl border border-gray-700"
        style={{ background: darkMode ? "linear-gradient(135deg, #1f2937, #111827)" : "linear-gradient(135deg, #f8fafc, #e2e8f0)" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            📝 TaskPilot
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-700 text-white p-2 rounded-md"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4 items-center">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (editingTask ? updateTask() : addTask())}
            className="md:col-span-2 px-4 py-2 rounded-md text-black w-full"
            placeholder="Write your task..."
          />
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            placeholderText="Due Date"
            className="text-black px-3 py-2 rounded-md text-sm w-full"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="text-black rounded-md px-2 py-2 w-full"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-black rounded-md px-2 py-2 w-full"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={editingTask ? updateTask : addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md w-full flex justify-center"
          >
            {editingTask ? <FaSave /> : <FaPlusCircle />}
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task list continues unchanged... */}
      </div>
      <footer className="absolute bottom-4 w-full text-center text-sm text-gray-400">
    Made with ❤️ by Archita
  </footer>
</main>
  );
}
