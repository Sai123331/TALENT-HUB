import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, Building, LayoutDashboard, PlusCircle, Headset } from 'lucide-react';
import SupportMessagesDrawer from './SupportMessagesDrawer';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-2">Platform overview and management.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <Link 
              to="/admin" 
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${path === '/admin' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </Link>
            <Link 
              to="/admin/users" 
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${path === '/admin/users' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Users className="w-5 h-5" />
              Users
            </Link>
            <Link 
              to="/admin/companies" 
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${path === '/admin/companies' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Building className="w-5 h-5" />
              Companies
            </Link>
            <Link 
              to="/admin/add-company" 
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${path === '/admin/add-company' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <PlusCircle className="w-5 h-5" />
              Add Company
            </Link>
            <Link 
              to="/admin/jobs" 
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${path === '/admin/jobs' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Briefcase className="w-5 h-5" />
              Jobs
            </Link>

            <div className="h-px bg-slate-200 my-4"></div>

            <button 
              onClick={() => setIsSupportOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-600 hover:bg-slate-100"
            >
              <Headset className="w-5 h-5" />
              Support
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {children}
          </div>
        </div>
      </div>
      <SupportMessagesDrawer 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
      />
    </div>
  );
}
