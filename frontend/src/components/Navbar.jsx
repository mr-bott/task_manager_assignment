import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-xl text-slate-800">TaskFlow</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors"
                >
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center">
                    <UserIcon size={14} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="px-2 py-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center">
                  <UserIcon size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{user?.name}</p>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="w-full px-4 py-3 text-center text-slate-700 hover:bg-slate-50 rounded-lg font-medium border border-slate-200 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="w-full px-4 py-3 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
