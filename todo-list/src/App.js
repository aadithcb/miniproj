import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select } from "./components/ui/select";
import { Sun, Moon, Clock, Calendar, Bookmark, Bell, Plus, List } from "lucide-react";

function BackgroundAnimation() {
  const particles = Array(30).fill(0);
  
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: "linear-gradient(120deg, #1a1a2e, #16213e, #0f3460, #1b1b2f)",
          animation: "gradientBG 15s ease infinite alternate",
          zIndex: -1,
          position: "fixed",
          width: "100vw",
          height: "100vh"
        }}
      />
      
      <AnimatePresence>
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SelectionPage() {
  const navigate = useNavigate();
  const options = [
    { title: "Schedule Task", icon: <Clock size={32} />, path: "/time" },
    { title: "View Tasks", icon: <List size={32} />, path: "/tasks" },
    { title: "Quick Note", icon: <Bookmark size={32} />, path: "/notes" }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white w-full p-4 md:p-10 overflow-hidden">
      <BackgroundAnimation />
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-10 relative z-10 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        TaskMaster Pro
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {options.map((option, index) => (
          <motion.div
            key={option.title}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
          >
            <Button 
              className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 text-xl w-full"
              onClick={() => navigate(option.path)}
            >
              <div className="mb-3">{option.icon}</div>
              {option.title}
            </Button>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        className="fixed bottom-8 right-8 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          className="rounded-full w-16 h-16 p-0 bg-gradient-to-br from-green-500 to-blue-500 shadow-lg"
          onClick={() => navigate("/time")}
        >
          <Plus size={32} />
        </Button>
      </motion.div>
    </div>
  );
}

function TaskInputPage({ onSave }) {
  const [formData, setFormData] = useState({
    task: "",
    date: "",
    time: "",
    priority: "Medium",
    category: "Work",
    notes: "",
    reminder: false,
    subtasks: [""]
  });
  
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...formData.subtasks];
    newSubtasks[index] = value;
    setFormData(prev => ({
      ...prev,
      subtasks: newSubtasks
    }));
  };

  const addSubtask = () => {
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, ""]
    }));
  };

  const removeSubtask = (index) => {
    if (formData.subtasks.length > 1) {
      const newSubtasks = formData.subtasks.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        subtasks: newSubtasks
      }));
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (formData.task.trim()) {
      const newTask = { 
        ...formData,
        id: Date.now(),
        subtasks: formData.subtasks.filter(st => st.trim())
      };
      onSave(newTask);
      
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
      
      navigate("/tasks");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="relative flex flex-col items-center p-4 md:p-10 bg-gray-900 text-white min-h-screen w-full">
      <BackgroundAnimation />
      
      <div className="flex justify-between items-center w-full px-4 md:px-10 relative z-10 mb-8">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold flex items-center gap-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Calendar size={28} /> Schedule Task
        </motion.h2>
        
        <motion.div whileHover={{ rotate: 15 }}>
          <Button 
            className="bg-gray-700 text-white p-3 rounded-full"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </motion.div>
      </div>
      
      <motion.div 
        className="w-full max-w-2xl space-y-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Input 
            name="task"
            placeholder="What needs to be done?"
            value={formData.task}
            onChange={handleChange}
            className="p-4 border-2 border-gray-700 bg-gray-800 text-white w-full text-lg pl-12"
            required
          />
          <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input 
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="p-4 border-2 border-gray-700 bg-gray-800 text-white w-full pl-12"
            />
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="relative">
            <Input 
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="p-4 border-2 border-gray-700 bg-gray-800 text-white w-full pl-12"
            />
            <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Select 
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="p-4 border-2 border-gray-700 bg-gray-800 text-white w-full appearance-none pl-12"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </Select>
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          
          <div className="relative">
            <Select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-4 border-2 border-gray-700 bg-gray-800 text-white w-full appearance-none pl-12"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
              <option value="Learning">Learning</option>
              <option value="Other">Other</option>
            </Select>
            <Bookmark className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Subtasks</h3>
          {formData.subtasks.map((subtask, index) => (
            <motion.div 
              key={index}
              className="flex gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Input
                value={subtask}
                onChange={(e) => handleSubtaskChange(index, e.target.value)}
                placeholder={`Subtask ${index + 1}`}
                className="p-3 border-2 border-gray-700 bg-gray-800 text-white flex-1"
              />
              <Button 
                type="button"
                className="bg-red-600 hover:bg-red-700 p-3"
                onClick={() => removeSubtask(index)}
                disabled={formData.subtasks.length <= 1}
              >
                ×
              </Button>
            </motion.div>
          ))}
          <Button 
            type="button"
            className="bg-gray-700 hover:bg-gray-600 mt-2"
            onClick={addSubtask}
          >
            + Add Subtask
          </Button>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Notes</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional details..."
            className="p-4 border-2 border-gray-700 bg-gray-800 text-white w-full rounded-md min-h-24"
          />
        </div>
        
        <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-md cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              name="reminder"
              checked={formData.reminder}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${formData.reminder ? 'bg-blue-600' : 'bg-gray-600'}`}>
              <motion.div 
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 ${formData.reminder ? 'right-0.5' : 'left-0.5'}`}
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bell size={18} />
            <span>Set Reminder</span>
          </div>
        </label>
        
        <motion.div 
          className="pt-6"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button 
            className={`w-full py-6 text-xl font-bold ${isSubmitting ? 'bg-blue-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
            onClick={handleFinish}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                ⏳
              </motion.span>
            ) : (
              "Create Task"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  const handleSaveTask = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<SelectionPage />} />
          <Route path="/time" element={<TaskInputPage onSave={handleSaveTask} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;