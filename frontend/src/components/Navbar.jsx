import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, User, KeyRound, LayoutDashboard, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 text-indigo-400 font-bold text-xl hover:text-indigo-300 transition">
          <ShieldCheck className="w-7 h-7" />
          <span>MERN Auth System</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 px-3 py-2 rounded-md text-sm font-medium transition bg-amber-500/10 border border-amber-500/20"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <div className="flex items-center space-x-2 pl-4 border-l border-slate-800">
                <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-400" />
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-slate-400 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md shadow-indigo-600/20 transition"
              >
                <KeyRound className="w-4 h-4" />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
