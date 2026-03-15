import { motion } from 'motion/react';
import { Briefcase, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              TALENT HUB
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/jobs" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Find Jobs</Link>
            <Link to="/companies" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Companies</Link>
            <Link to="/saved-jobs" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Saved Jobs</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link 
                to="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                Log in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-b border-slate-200"
        >
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link to="/jobs" onClick={() => setIsOpen(false)} className="block text-base font-medium text-slate-600 hover:text-indigo-600">Find Jobs</Link>
            <Link to="/companies" onClick={() => setIsOpen(false)} className="block text-base font-medium text-slate-600 hover:text-indigo-600">Companies</Link>
            <Link to="/saved-jobs" onClick={() => setIsOpen(false)} className="block text-base font-medium text-slate-600 hover:text-indigo-600">Saved Jobs</Link>
            <div className="pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <Link 
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 text-base font-medium text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-xl py-2.5"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center text-base font-medium text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-xl py-2.5">
                  Log in
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
