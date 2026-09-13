import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Calendar, 
  Clock, 
  Tag, 
  Sun, 
  Moon, 
  Flame, 
  ArrowRight 
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Coding', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { name: 'Work', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { name: 'Health & Fitness', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { name: 'Learning', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { name: 'Personal', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
];

const PRIORITIES = {
  High: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('today');

  const [todayTasks, setTodayTasks] = useState(() => {
    const saved = localStorage.getItem('planner_today_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [tomorrowTasks, setTomorrowTasks] = useState(() => {
    const saved = localStorage.getItem('planner_tomorrow_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('planner_today_tasks', JSON.stringify(todayTasks));
  }, [todayTasks]);

  useEffect(() => {
    localStorage.setItem('planner_tomorrow_tasks', JSON.stringify(tomorrowTasks));
  }, [tomorrowTasks]);

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [priority, setPriority] = useState('Medium');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      time,
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    if (activeTab === 'today') {
      setTodayTasks((prev) => [newTask, ...prev]);
    } else {
      setTomorrowTasks((prev) => [...prev, newTask]);
    }

    setTitle('');
    setTime('');
  };

  const toggleTask = (id, isToday) => {
    const updater = (tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
    if (isToday) setTodayTasks(updater);
    else setTomorrowTasks(updater);
  };

  const deleteTask = (id, isToday) => {
    const updater = (tasks) => tasks.filter((task) => task.id !== id);
    if (isToday) setTodayTasks(updater);
    else setTomorrowTasks(updater);
  };

  const moveTaskToToday = (id) => {
    const task = tomorrowTasks.find((t) => t.id === id);
    if (task) {
      setTomorrowTasks((prev) => prev.filter((t) => t.id !== id));
      setTodayTasks((prev) => [{ ...task, completed: false }, ...prev]);
    }
  };

  const currentTasks = activeTab === 'today' ? todayTasks : tomorrowTasks;
  const completedCount = currentTasks.filter((t) => t.completed).length;
  const progress = currentTasks.length 
    ? Math.round((completedCount / currentTasks.length) * 100) 
    : 0;

  return (
    <div className="w-full min-h-screen flex justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative background blur elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-3xl space-y-8 relative z-10">
        
        {/* Navigation & Brand Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Flame className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-white">Daily Tracker</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 pl-10">
              Manage day-to-day focus and plan ahead without clutter.
            </p>
          </div>

          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'today'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Today
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tomorrow')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tomorrow'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Tomorrow
            </button>
          </div>
        </header>

        {/* Progress Metric Bar */}
        <div className="glass-panel p-5 rounded-3xl flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-white tracking-tight">
              {progress}%
            </div>
            <div className="text-xs text-slate-400 leading-tight">
              <span>{completedCount} of {currentTasks.length} tasks completed</span>
              <div className="text-slate-500 mt-0.5">
                {progress === 100 && currentTasks.length > 0 ? "All set for now!" : "Keep the momentum going"}
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-xs bg-slate-800/80 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                activeTab === 'today' ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-purple-500 shadow-sm shadow-purple-500/50'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Task Form */}
        <form onSubmit={handleAddTask} className="glass-panel rounded-3xl p-5 sm:p-6 space-y-5 transition-all duration-300 focus-within:border-indigo-500/30">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={activeTab === 'today' ? "What are you working on right now?" : "What needs attention tomorrow?"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 transition"
              required
            />
            <button
              type="submit"
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition active:scale-95 shadow-lg ${
                activeTab === 'today'
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                  : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Time / Duration (e.g. 2 hrs)" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                className="bg-transparent focus:outline-none w-full text-slate-300 placeholder:text-slate-500" 
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent focus:outline-none w-full text-slate-300 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name} className="bg-slate-900 text-slate-200">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-transparent focus:outline-none w-full text-slate-300 cursor-pointer"
              >
                <option value="Low" className="bg-slate-900 text-slate-200">Low Priority</option>
                <option value="Medium" className="bg-slate-900 text-slate-200">Medium Priority</option>
                <option value="High" className="bg-slate-900 text-slate-200">High Priority</option>
              </select>
            </div>
          </div>
        </form>

        {/* Activities List */}
        <div className="space-y-2.5">
          {currentTasks.length === 0 ? (
            <div className="text-center py-14 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800/80 text-slate-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-xs font-medium">No tasks logged in this view.</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Use the input bar above to record items.</p>
            </div>
          ) : (
            currentTasks.map((task) => {
              const catStyle = CATEGORIES.find((c) => c.name === task.category)?.color || 'bg-slate-800 text-slate-300 border-slate-700';
              const priorityStyle = PRIORITIES[task.priority] || PRIORITIES.Medium;

              return (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                    task.completed 
                      ? 'bg-slate-900/20 border border-white/5 opacity-50 grayscale-[50%]' 
                      : 'glass-card hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id, activeTab === 'today')}
                      className="text-slate-500 hover:text-emerald-400 transition shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs sm:text-sm font-medium truncate ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}>
                        {task.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {task.time && (
                          <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60">
                            {task.time}
                          </span>
                        )}
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${catStyle}`}>
                          {task.category}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${priorityStyle}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-3 shrink-0">
                    {activeTab === 'tomorrow' && (
                      <button
                        type="button"
                        onClick={() => moveTaskToToday(task.id)}
                        className="text-[11px] font-medium text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-600 border border-purple-500/20 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                      >
                        Today
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id, activeTab === 'today')}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}