import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Briefcase, LogOut, CheckCircle, Clock, XCircle, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function MyApplications() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.token) return;
      try {
        setLoading(true);
        const response = await fetch('https://talent-hub-be.onrender.com/api/applications/my', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch applications');
        const data = await response.json();
        setApplications(data);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hired':
        return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' };
      case 'interviewing':
        return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' };
      default:
        return { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <p className="text-slate-500">Track the status of your job applications.</p>
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">
                Total: {applications.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden border border-indigo-50">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture.startsWith('http') ? user.profilePicture : `https://talent-hub-be.onrender.com${user.profilePicture}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-xl font-bold text-indigo-600">{user?.firstName?.charAt(0)}</span>
                  )}
                </div>
                <div className="text-left overflow-hidden">
                  <h2 className="text-lg font-bold text-slate-900 truncate">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-2">
                <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <User className="w-5 h-5" />
                  Personal Info
                </Link>
                <Link to="/applications" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl transition-colors">
                  <Briefcase className="w-5 h-5" />
                  My Applications
                </Link>
                <Link to="/resume" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <FileText className="w-5 h-5" />
                  Resume / CV
                </Link>
                <div className="h-px bg-slate-100 my-2 mx-4"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Application History</h3>
              
              <div className="space-y-4">
                {applications.length > 0 ? applications.map((app) => {
                  const statusInfo = getStatusInfo(app.status);
                  const Icon = statusInfo.icon;
                  return (
                    <div key={app._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusInfo.bg}`}>
                          <Icon className={`w-6 h-6 ${statusInfo.color}`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{app.job?.title}</h4>
                          <p className="text-sm text-slate-500">{app.job?.company?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                          {app.status}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                    <div className="text-center py-12">
                        <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500">You haven't applied for any jobs yet.</p>
                        <Link to="/jobs" className="text-indigo-600 font-bold mt-2 inline-block">Browse Jobs</Link>
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
