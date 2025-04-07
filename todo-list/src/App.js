import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiClock, FiBook, FiHome, FiSettings, FiLogOut, FiPlus, FiTrash2, FiEdit2, FiStar } from 'react-icons/fi';
import { FaGraduationCap, FaTasks, FaBookReader, FaChartLine } from 'react-icons/fa';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      name: "aadith",
      major: "Computer Science",
      avatar: "https://i.pravatar.cc/150?img=3",
      university: "VIT VELLORE University",
      semester: "Fall 2025"
    };
  });
  const [tempUser, setTempUser] = useState({...user});

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUser(prev => ({...prev, [name]: value}));
  };

  const saveUserInfo = () => {
    setUser(tempUser);
    setEditMode(false);
  };

  const cancelEdit = () => {
    setTempUser(user);
    setEditMode(false);
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex h-screen overflow-hidden">
        <motion.div 
          className={`w-64 p-4 flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <div className="flex items-center space-x-3 mb-8 p-2">
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full" />
            <div>
              {editMode ? (
                <>
                  <input type="text" name="name" value={tempUser.name} onChange={handleInputChange} className={`w-full p-1 mb-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-b`} />
                  <input type="text" name="major" value={tempUser.major} onChange={handleInputChange} className={`w-full p-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-b`} />
                  <input type="text" name="university" value={tempUser.university} onChange={handleInputChange} className={`w-full p-1 mt-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-b`} />
                  <input type="text" name="semester" value={tempUser.semester} onChange={handleInputChange} className={`w-full p-1 mt-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-b`} />
                </>
              ) : (
                <>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.major}</p>
                  <p className="text-xs text-gray-400">{user.university}</p>
                  <p className="text-xs text-gray-400">{user.semester}</p>
                </>
              )}
            </div>
          </div>

          {editMode ? (
            <div className="flex space-x-2 mt-2">
              <button onClick={saveUserInfo} className="flex-1 p-2 bg-green-500 text-white rounded-lg">Save</button>
              <button onClick={cancelEdit} className="flex-1 p-2 bg-gray-500 text-white rounded-lg">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setEditMode(true)} className={`p-2 mb-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>Edit Profile</button>
          )}

          <nav className="flex-1 space-y-1">
            <SidebarButton icon={<FiHome />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>Dashboard</SidebarButton>
            <SidebarButton icon={<FaTasks />} active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>Tasks</SidebarButton>
            <SidebarButton icon={<FiCalendar />} active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')}>Schedule</SidebarButton>
            <SidebarButton icon={<FaBookReader />} active={activeTab === 'resources'} onClick={() => setActiveTab('resources')}>Resources</SidebarButton>
            <SidebarButton icon={<FaChartLine />} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>Analytics</SidebarButton>
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button onClick={() => setDarkMode(!darkMode)} className={`flex items-center w-full p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <FiSettings className="mr-3" />
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className={`flex items-center w-full p-3 rounded-lg text-red-500 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </div>
        </motion.div>

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard darkMode={darkMode} user={user} />}
            {activeTab === 'tasks' && <TaskManager darkMode={darkMode} />}
            {activeTab === 'schedule' && <ClassSchedule darkMode={darkMode} />}
            {activeTab === 'resources' && <StudyResources darkMode={darkMode} />}
            {activeTab === 'analytics' && <PerformanceAnalytics darkMode={darkMode} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const SidebarButton = ({ children, icon, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center w-full p-3 rounded-lg transition-colors ${active ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
    <span className="mr-3">{icon}</span>
    {children}
  </button>
);

const Dashboard = ({ darkMode, user }) => {
  const [tasks] = useState([
    { id: 1, title: 'Complete React Project', due: '2023-06-15', priority: 'high', completed: false },
    { id: 2, title: 'Study for Calculus Exam', due: '2023-06-16', priority: 'medium', completed: true },
    { id: 3, title: 'Read Chapter 5 of Biology', due: '2023-06-14', priority: 'high', completed: false }
  ]);

  const [classes] = useState([
    { id: 1, name: 'Computer Science', time: 'Mon/Wed 10:00 AM', location: 'Room 302' },
    { id: 2, name: 'Mathematics', time: 'Tue/Thu 2:00 PM', location: 'Room 415' }
  ]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name.split(' ')[0]}!</h1>
      <p className="mb-6 text-gray-500 dark:text-gray-400">{user.university} • {user.semester}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center"><FaTasks className="mr-2" /> Upcoming Tasks</h2>
          <div className="space-y-3">
            {tasks.filter(t => !t.completed).slice(0, 3).map(task => (
              <TaskItem key={task.id} task={task} darkMode={darkMode} />
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center"><FiCalendar className="mr-2" /> Today's Classes</h2>
          <div className="space-y-3">
            {classes.slice(0, 2).map(cls => (
              <ClassItem key={cls.id} cls={cls} darkMode={darkMode} />
            ))}
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <h2 className="text-xl font-bold mb-4 flex items-center"><FaChartLine className="mr-2" /> Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="12" label="Pending Tasks" icon={<FaTasks />} darkMode={darkMode} />
          <StatCard value="3" label="Classes Today" icon={<FiCalendar />} darkMode={darkMode} />
          <StatCard value="87%" label="Productivity" icon={<FiStar />} darkMode={darkMode} />
          <StatCard value="14" label="Study Hours" icon={<FiClock />} darkMode={darkMode} />
        </div>
      </div>
    </motion.div>
  );
};

const TaskManager = ({ darkMode }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Complete React Project', due: '2023-06-15', priority: 'high', completed: false },
      { id: 2, title: 'Study for Calculus Exam', due: '2023-06-16', priority: 'medium', completed: true }
    ];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTask,
        due: '',
        priority: 'medium',
        completed: false
      }]);
      setNewTask('');
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          <FiPlus className="mr-2" /> Add Task
        </button>
      </div>

      <div className={`p-6 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className={`flex-1 p-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border'}`}
          />
          <button onClick={addTask} className="px-4 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition">Add</button>
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <motion.div key={task.id} className={`flex items-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white shadow'}`} whileHover={{ x: 5 }} layout>
              <button onClick={() => toggleComplete(task.id)} className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${task.completed ? 'bg-green-500 text-white' : 'border-2 border-gray-300 dark:border-gray-500'}`}>
                {task.completed && <FiCheckCircle size={14} />}
              </button>
              <div className="flex-1">
                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{task.title}</h3>
                <p className="text-sm text-gray-500">{task.due && `Due: ${task.due}`}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'}`}>
                {task.priority}
              </span>
              <button onClick={() => deleteTask(task.id)} className="ml-3 text-red-500 hover:text-red-700 dark:hover:text-red-400">
                <FiTrash2 />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ClassSchedule = ({ darkMode }) => {
  const [classes] = useState([
    { id: 1, name: 'Computer Science', time: 'Mon/Wed 10:00 AM', location: 'Room 302' },
    { id: 2, name: 'Mathematics', time: 'Tue/Thu 2:00 PM', location: 'Room 415' }
  ]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1 className="text-3xl font-bold mb-6">Class Schedule</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <motion.div key={cls.id} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`} whileHover={{ scale: 1.02 }}>
            <h3 className="text-xl font-bold mb-2">{cls.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-1"><span className="font-medium">Time:</span> {cls.time}</p>
            <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Location:</span> {cls.location}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const StudyResources = ({ darkMode }) => {
  const [resources] = useState([
    { id: 1, title: "CS-101 Study Guide", course: "Computer Science", type: "PDF", sharedBy: "professor" },
    { id: 2, title: "Math Formulas", course: "Mathematics", type: "Cheat Sheet", sharedBy: "tra" }
  ]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1 className="text-3xl font-bold mb-6">Study Resources</h1>
      <div className="space-y-4">
        {resources.map(resource => (
          <motion.div key={resource.id} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`} whileHover={{ x: 5 }}>
            <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{resource.course}</span>
              <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{resource.type}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-auto">Shared by: {resource.sharedBy}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const PerformanceAnalytics = ({ darkMode }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1 className="text-3xl font-bold mb-6">Performance Analytics</h1>
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Performance charts coming soon...</p>
        </div>
      </div>
    </motion.div>
  );
};

const TaskItem = ({ task, darkMode }) => (
  <div className="flex items-center">
    <div className={`w-3 h-3 rounded-full mr-3 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
    <span className={`${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{task.title}</span>
  </div>
);

const ClassItem = ({ cls, darkMode }) => (
  <div className="flex justify-between">
    <span>{cls.name}</span>
    <span className="text-gray-500 dark:text-gray-400">{cls.time}</span>
  </div>
);

const StatCard = ({ value, label, icon, darkMode }) => (
  <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
    <div className="text-3xl font-bold mb-2">{value}</div>
    <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
      <span className="mr-2">{icon}</span>
      {label}
    </div>
  </div>
);

export default App; 







