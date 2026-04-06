import { motion } from 'motion/react';
import { Users, Briefcase, Building, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Jobs
        const jobsRes = await fetch('http://localhost:5000/api/jobs');
        const jobsData = await jobsRes.json();
        
        // 2. Fetch Companies
        const companiesRes = await fetch('http://localhost:5000/api/companies');
        const companiesData = await companiesRes.json();

        // 3. Fetch Users
        const usersRes = await fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        const usersData = await usersRes.json();

        // 4. Set Stats
        setStats([
          { label: 'Total Users', value: Array.isArray(usersData) ? usersData.length.toString() : '0', change: '0%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/users' },
          { label: 'Active Jobs', value: jobsData.length.toString(), change: '+5%', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/jobs' },
          { label: 'Companies', value: companiesData.length.toString(), change: '+18%', icon: Building, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/companies' },
          { label: 'Add Company', value: 'New', change: 'Create', icon: PlusCircle, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/add-company' },
        ]);

        // 4. Set Recent Jobs (last 4)
        setRecentJobs(jobsData.slice(-4).reverse().map((j: any) => ({
            id: j._id,
            title: j.title,
            company: j.company?.name || 'Unknown',
            status: 'Active',
            date: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : 'Today'
        })));

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={stat.link}
                      className={`block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all ${stat.link !== '#' ? 'hover:shadow-md hover:border-indigo-200 hover:-translate-y-1' : ''}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                      <div className="flex items-end justify-between mt-1">
                        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                          {stat.change}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Jobs Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Recent Job Postings</h3>
                <Link to="/admin/jobs" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900">{job.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                          {job.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                            job.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {job.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-5 h-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
    </AdminLayout>
  );
}
