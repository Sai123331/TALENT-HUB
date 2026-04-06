import { motion } from 'motion/react';
import { Search, MapPin, Users, Briefcase, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';

export default function Companies() {
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
        // Map _id to id for compatibility
        const mappedCompanies = data.map((c: any) => ({
          ...c,
          id: c._id,
          // openJobs might need a separate count or be part of the response if we update the backend
          openJobs: 0 
        }));
        setCompanies(mappedCompanies);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-slate-600">
        <p className="text-xl font-semibold mb-2">Oops! Something went wrong.</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Discover top companies</h1>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Company name or industry" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow" 
              />
            </div>
            <button className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <motion.div 
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer flex flex-col h-full"
            >
              <Link to={`/companies/${company.id}`} className="flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <img src={getImageUrl(company.logo, 'company')} alt={company.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100" referrerPolicy="no-referrer" loading="lazy" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium">{company.industryType}</p>
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm mb-6 flex-grow">{company.description}</p>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Users className="w-4 h-4 text-slate-400" />
                    {company.employees} employees
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{company.openJobs}</span> open positions
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
