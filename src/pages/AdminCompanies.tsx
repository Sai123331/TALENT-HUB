import { motion } from 'motion/react';
import { Trash2, Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/companies');
        if (!response.ok) throw new Error('Failed to fetch companies');
        const data = await response.json();
        setCompanies(data.map((c: any) => ({
            ...c,
            id: c._id,
            jobs: c.jobCount || 0,
            status: 'Verified'
        })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this company? This will also delete all its jobs and applications.')) return;
    
    setDeletingId(id);
    try {
        const response = await fetch(`http://localhost:5000/api/companies/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user?.token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete company');
        
        setCompanies(companies.filter(c => c.id !== id));
    } catch (err: any) {
        alert(err.message);
    } finally {
        setDeletingId(null);
    }
  };

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Manage Companies</h3>
            <p className="text-sm text-slate-500">View and manage registered companies.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/admin/add-company" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Company
            </Link>
          </div>
        </div>

        {error && (
            <div className="p-4 mx-6 mt-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
            </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Jobs</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {companies.length > 0 ? companies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 overflow-hidden">
                        {company.logo ? (
                          <img src={getImageUrl(company.logo, 'company')} alt="" className="w-full h-full object-cover" />
                        ) : (
                          company.name?.charAt(0)
                        )}
                      </div>
                      <div className="font-semibold text-slate-900">{company.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {company.industryType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {company.jobs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(company.id)}
                      disabled={deletingId === company.id}
                      className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      {deletingId === company.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5 inline" />
                      )}
                    </button>
                  </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          No companies found.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
