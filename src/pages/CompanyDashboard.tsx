import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Users, Plus, MapPin, Clock, TrendingUp, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        // Fetch company jobs
        const jobsRes = await fetch(`https://talent-hub-be.onrender.com/api/jobs/company/${user._id}`);
        const jobsData = await jobsRes.json();

        // Fetch company applicants
        const appsRes = await fetch(`https://talent-hub-be.onrender.com/api/applications/company/${user._id}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const appsData = await appsRes.json();

        setJobs(jobsData);
        setApplicants(appsData);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const STATS = [
    { id: 1, name: 'Active Jobs', value: jobs.length.toString(), icon: Briefcase, change: '+1 this week' },
    { id: 2, name: 'Total Applicants', value: applicants.length.toString(), icon: Users, change: '+12% this month' },
    { id: 3, name: 'Hired', value: applicants.filter(a => a.status === 'Hired').length.toString(), icon: CheckCircle, change: 'Lifetime' },
  ];

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

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Company Dashboard</h1>
          </div>
          <Link to="/post-job" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Post New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.name}</h3>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Jobs List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Your Job Postings</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {jobs.length > 0 ? jobs.map((job) => (
                  <li key={job._id} className="p-6 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                          <span className="text-sm font-medium text-slate-600">
                            {applicants.filter(a => a.job?._id === job._id).length} applicants
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                )) : (
                  <li className="p-12 text-center text-slate-500">No jobs posted yet.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Recent Applicants */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Manage Applicants</h2>
              <Link to="/dashboard/applicants" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
              <div className="space-y-6">
                {applicants.length > 0 ? applicants.map((app) => (
                  <div key={app._id} className="p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors bg-slate-50/50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {app.applicant?.firstName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{app.applicant?.firstName} {app.applicant?.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">For {app.job?.title}</p>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {app.status}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(app._id, 'Hired')}
                        disabled={updatingId === app._id || app.status === 'Hired'}
                        className="flex-1 py-1.5 px-3 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Hire
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                        disabled={updatingId === app._id || app.status === 'Rejected'}
                        className="flex-1 py-1.5 px-3 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-slate-500 py-8">No applicants yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
