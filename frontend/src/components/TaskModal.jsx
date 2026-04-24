import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../store/slices/taskSlice';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  status: yup.string().oneOf(['Pending', 'In Progress', 'Completed']).default('Pending'),
  dueDate: yup.string().nullable(),
});

const TaskModal = ({ isOpen, onClose, task = null }) => {
  const dispatch = useDispatch();
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'Pending',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    },
  });

  const onSubmit = async (data) => {
    // Convert empty string back to null for dueDate if necessary
    const formattedData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };

    if (isEditing) {
      await dispatch(updateTask({ id: task.id, taskData: formattedData }));
    } else {
      await dispatch(createTask(formattedData));
    }
    
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-100">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              {...register('title')}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.title ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-500'
              } focus:outline-none focus:ring-2 transition-all`}
              placeholder="e.g., Update landing page"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-all resize-none"
              placeholder="Add more details about this task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-all bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-all text-slate-700"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
