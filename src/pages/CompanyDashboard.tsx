import { motion } from 'motion/react';
import { Briefcase, Users, Eye, Plus, MoreVertical, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATS = [
  { id: 1, name: 'Active Jobs', value: '3', icon: Briefcase, change: '+1 this week', changeType: 'positive' },
  { id: 2, name: 'Total Applicants', value: '124', icon: Users, change: '+12% from last month', changeType: 'positive' },
  { id: 3, name: 'Profile Views', value: '892', icon: Eye, change: '+5% from last week', changeType: 'positive' },
];

const ACTIVE_JOBS = [
  { id: 1, title: 'Senior Frontend Engineer', type: 'Full-time', location: 'San Francisco, CA', applicants: 45, posted: '2 days ago', status: 'Active' },
  { id: 2, title: 'Product Designer', type: 'Full-time', location: 'Remote', applicants: 32, posted: '5 days ago', status: 'Active' },
  { id: 3, title: 'Backend Developer', type: 'Contract', location: 'New York, NY', applicants: 18, posted: '1 week ago', status: 'Active' },
];

const RECENT_APPLICANTS = [
  { id: 1, name: 'Sarah Jenkins', role: 'Senior Frontend Engineer', applied: '2 hours ago', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 2, name: 'Michael Chen', role: 'Product Designer', applied: '5 hours ago', avatar: 'https://i.pravatar.cc/150?u=michael' },
  { id: 3, name: 'Emily Rodriguez', role: 'Backend Developer', applied: '1 day ago', avatar: 'https://i.pravatar.cc/150?u=emily' },
  { id: 4, name: 'David Kim', role: 'Senior Frontend Engineer', applied: '1 day ago', avatar: 'https://i.pravatar.cc/150?u=david' },
];

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Company Dashboard</h1>
            <p className="text-slate-600">Welcome back! Here's what's happening with your job listings.</p>
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Active Job Postings</h2>
              <Link to="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {ACTIVE_JOBS.map((job) => (
                  <li key={job.id} className="p-6 hover:bg-slate-50 transition-colors group">
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
                            {job.posted}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {job.status}
                          </span>
                          <span className="text-sm font-medium text-slate-600">
                            {job.applicants} applicants
                          </span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Applicants */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Applicants</h2>
              <Link to="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="space-y-6">
                {RECENT_APPLICANTS.map((applicant) => (
                  <div key={applicant.id} className="flex items-center gap-4">
                    <img 
                      src={applicant.avatar} 
                      alt={applicant.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{applicant.name}</p>
                      <p className="text-xs text-slate-500 truncate">Applied for {applicant.role}</p>
                    </div>
                    <div className="text-xs text-slate-400 whitespace-nowrap">
                      {applicant.applied}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                View All Applicants
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
