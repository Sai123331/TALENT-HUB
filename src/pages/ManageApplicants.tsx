import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Briefcase, Mail, Phone, Clock, Loader2, CheckCircle, XCircle, Search, Filter, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

export default function ManageApplicants() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const response = await fetch(`https://talent-hub-be.onrender.com/api/applications/company/${user._id}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch applicants');
        const data = await response.json();
        setApplicants(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [user]);

  const handleStatusUpdate = async (appId: string, status: string) => {
    setUpdatingId(appId);
    try {
      const response = await fetch(`https://talent-hub-be.onrender.com/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setApplicants(applicants.map(app =>
        app._id === appId ? { ...app, status } : app
      ));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch = 
      (app.applicant?.firstName + ' ' + app.applicant?.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const STATUS_COLORS: any = {
    'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'Reviewed': 'bg-blue-100 text-blue-800 border-blue-200',
    'Shortlisted': 'bg-purple-100 text-purple-800 border-purple-200',
    'Hired': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Rejected': 'bg-rose-100 text-rose-800 border-rose-200'
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Manage Applicants</h1>
            <p className="text-slate-500">Review and update status for all job seekers.</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or job title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-400 hidden sm:block" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applicants List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredApplicants.length > 0 ? filteredApplicants.map((app, index) => (
            <motion.div 
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Applicant Info */}
                  <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl border border-indigo-100 shrink-0 overflow-hidden">
                    {app.applicant?.profilePicture ? (
                      <img src={getImageUrl(app.applicant.profilePicture)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      app.applicant?.firstName?.charAt(0)
                    )}
                  </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 leading-none">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-indigo-600 font-medium text-sm mb-3">Applied for: {app.job?.title}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {app.applicant?.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {app.applicant?.phoneNumber || 'No phone'}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 lg:border-l lg:pl-8 lg:ml-4 border-slate-100">

                    {app.resume && (
                      <Link 
                        to={`/dashboard/applicants/${app._id}/resume`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors text-sm border border-slate-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Resume
                      </Link>
                    )}
                    
                    <div className="h-8 w-px bg-slate-100 hidden lg:block mx-2"></div>
                    
                    <div className="flex items-center gap-2">
                       <button
                        onClick={() => handleStatusUpdate(app._id, 'Hired')}
                        disabled={updatingId === app._id || app.status === 'Hired'}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 border border-emerald-100"
                        title="Hire"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                        disabled={updatingId === app._id || app.status === 'Rejected'}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 border border-rose-100"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      
                      <select 
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                        disabled={updatingId === app._id}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer disabled:opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {app.coverLetter && (
                  <div className="mt-6 pt-6 border-t border-slate-50">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Cover Letter Statement</h4>
                    <p className="text-sm text-slate-600 bg-slate-50/50 p-4 rounded-xl italic">
                      "{app.coverLetter}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No applicants found</h3>
              <p className="text-slate-500 mb-6">No applications match your current search or filters.</p>
              <button 
                onClick={() => {setSearchQuery(''); setFilterStatus('All');}}
                className="text-indigo-600 font-medium hover:text-indigo-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
