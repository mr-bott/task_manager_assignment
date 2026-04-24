import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, setFilter } from '../store/slices/taskSlice';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, Search, Filter, LayoutDashboard, CheckCircle2, Clock } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading, filters } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch, filters.status, filters.sort]);

  const handleOpenModal = (task = null) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  // Derived stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = totalTasks - completedTasks;

  // Filter tasks locally by search term
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Stats */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {user?.name.split(' ')[0]}. Here's your task overview.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Tasks</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalTasks}</h3>
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Tasks</p>
              <h3 className="text-2xl font-bold text-slate-800">{pendingTasks}</h3>
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <h3 className="text-2xl font-bold text-slate-800">{completedTasks}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter size={16} />
            </div>
            <select
              onChange={(e) => dispatch(setFilter({ status: e.target.value }))}
              className="pl-9 w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-all bg-white appearance-none pr-8 cursor-pointer text-sm font-medium text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm shadow-indigo-200 whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Task Grid */}
      {loading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-40 animate-pulse bg-slate-200/50"></div>
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleOpenModal} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No tasks found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            {searchTerm ? "We couldn't find any tasks matching your search." : "You're all caught up! Create a new task to get started."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => handleOpenModal()}
              className="mt-6 text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
            >
              Create your first task
            </button>
          )}
        </div>
      )}

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        task={taskToEdit} 
      />
    </div>
  );
};

export default Dashboard;
