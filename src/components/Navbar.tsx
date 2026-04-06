import { motion } from 'motion/react';
import { Briefcase, Menu, X, User } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');
  
  const getHomeLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'company') return '/dashboard';
    return '/';
  };

  const showNavLinks = !user || user.role === 'user';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to={getHomeLink()} className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              TALENT HUB
            </span>
          </Link>

          {/* Desktop Nav */}
          {showNavLinks && (
            <div className="hidden md:flex items-center gap-8">
              <Link to="/jobs" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Find Jobs</Link>
              <Link to="/companies" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Companies</Link>
              <Link to="/saved-jobs" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Saved Jobs</Link>
              <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Contact Us</Link>
            </div>
          )}

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors overflow-hidden border border-slate-200"
                  title="View Profile"
                >
                  {user?.profilePicture ? (
                    <img 
                      src={getImageUrl(user.profilePicture)} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Link>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                Log in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
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
            {showNavLinks && (
              <>
                <Link to="/jobs" onClick={closeMenu} className="block text-base font-medium text-slate-600 hover:text-indigo-600">Find Jobs</Link>
                <Link to="/companies" onClick={closeMenu} className="block text-base font-medium text-slate-600 hover:text-indigo-600">Companies</Link>
                <Link to="/saved-jobs" onClick={closeMenu} className="block text-base font-medium text-slate-600 hover:text-indigo-600">Saved Jobs</Link>
                <Link to="/contact" onClick={closeMenu} className="block text-base font-medium text-slate-600 hover:text-indigo-600">Contact Us</Link>
              </>
            )}
            <div className="pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center gap-2 text-base font-medium text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-xl py-2.5"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
              ) : (
                <Link to="/login" onClick={closeMenu} className="w-full text-center text-base font-medium text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-xl py-2.5">
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
