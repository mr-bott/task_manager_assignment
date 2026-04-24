import { format } from 'date-fns';
import { Calendar, Clock, Edit2, Trash2, CheckCircle, Circle, MoreVertical } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateTaskStatus, deleteTask } from '../store/slices/taskSlice';
import { useState } from 'react';

const TaskCard = ({ task, onEdit }) => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleStatus = () => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };

  const statusColors = {
    'Pending': 'bg-slate-100 text-slate-600 border-slate-200',
    'In Progress': 'bg-blue-50 text-blue-600 border-blue-200',
    'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };

  return (
    <div className={`glass-card p-5 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border ${task.status === 'Completed' ? 'border-emerald-100/50 opacity-80' : 'border-slate-200/50'}`}>
      <div className="flex justify-between items-start gap-4">
        
        {/* Checkbox and Title area */}
        <div className="flex items-start gap-3 flex-1">
          <button 
            onClick={toggleStatus}
            className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-emerald-500 transition-colors focus:outline-none"
          >
            {task.status === 'Completed' ? (
              <CheckCircle className="text-emerald-500" size={22} />
            ) : (
              <Circle size={22} />
            )}
          </button>
          
          <div className="flex-1">
            <h4 className={`font-semibold text-lg leading-tight mb-1 transition-colors ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className={`text-sm mb-3 line-clamp-2 ${task.status === 'Completed' ? 'text-slate-400' : 'text-slate-500'}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 relative">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[task.status]}`}>
            {task.status}
          </span>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-10 overflow-hidden">
                <button 
                  onClick={() => { setIsMenuOpen(false); onEdit(task); }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); handleDelete(); }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center gap-4 text-xs text-slate-500">
        {task.dueDate && (
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar size={14} className={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-red-500' : 'text-slate-400'} />
            <span className={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-red-500' : ''}>
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-slate-400" />
          <span>Created {format(new Date(task.createdAt), 'MMM d')}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
