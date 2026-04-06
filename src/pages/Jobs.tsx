import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, DollarSign, Bookmark, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAuth } from '../context/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';

export default function Jobs() {
  const { isJobSaved, toggleSavedJob } = useSavedJobs();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.ok ? await response.json() : [];
        // Map _id to id for compatibility and extract company name
        const mappedJobs = data.map((job: any) => ({
          ...job,
          id: job._id,
          company: job.company?.name || 'Unknown Company',
          logo: job.company?.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&h=128&fit=crop',
          posted: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'
        }));
        setJobs(mappedJobs);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const parsePostedDate = useCallback((posted: string) => {
    if (posted.toLowerCase() === 'just now' || posted.toLowerCase() === 'recently') return 0;
    const match = posted.match(/(\d+)\s+(day|week|month|year)/i);
    if (!match) {
        // If it's a date string from toLocaleDateString, we can try to compare timestamps
        const date = new Date(posted);
        if (!isNaN(date.getTime())) {
            return (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
        }
        return 999;
    }
    const val = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit === 'day') return val;
    if (unit === 'week') return val * 7;
    if (unit === 'month') return val * 30;
    if (unit === 'year') return val * 365;
    return val;
  }, []);

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      if (sortBy === 'location') return a.location.localeCompare(b.location);
      if (sortBy === 'date-desc') return parsePostedDate(a.posted) - parsePostedDate(b.posted);
      if (sortBy === 'date-asc') return parsePostedDate(b.posted) - parsePostedDate(a.posted);
      return 0;
    });
  }, [jobs, sortBy, parsePostedDate]);

  const jobsPerPage = 10;
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = useMemo(() => sortedJobs.slice(startIndex, startIndex + jobsPerPage), [sortedJobs, startIndex, jobsPerPage]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSaveJob = useCallback((e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    if (isAuthenticated) {
      toggleSavedJob(jobId);
    } else {
      setShowLoginPrompt(true);
    }
  }, [isAuthenticated, toggleSavedJob]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Find your next opportunity</h1>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Job title, keyword, or company" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow" 
              />
            </div>
            <button className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Job List */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <span className="text-slate-600 font-medium">Showing {sortedJobs.length} jobs</span>
              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm font-medium text-slate-700">Sort by:</label>
                <select 
                  id="sort"
                  value={sortBy} 
                  onChange={handleSortChange}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-700 shadow-sm cursor-pointer"
                >
                  <option value="default">Recommended</option>
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="title">Job Title (A-Z)</option>
                  <option value="company">Company (A-Z)</option>
                  <option value="location">Location (A-Z)</option>
                </select>
              </div>
            </div>

            {currentJobs.map((job, index) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:shadow-indigo-100/50 hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                <button 
                  onClick={(e) => handleSaveJob(e, job.id)}
                  className={`absolute top-6 right-6 p-2 rounded-lg transition-colors z-10 ${
                    isJobSaved(job.id) 
                      ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' 
                      : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  aria-label={isJobSaved(job.id) ? "Remove from saved jobs" : "Save job"}
                >
                  <Bookmark className={`w-5 h-5 ${isJobSaved(job.id) ? 'fill-current' : ''}`} />
                </button>

                <Link to={`/jobs/${job.id}`} className="block p-6 pr-20">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={getImageUrl(job.logo, 'company')} alt={job.company} className="w-12 h-12 rounded-xl object-cover border border-slate-100" referrerPolicy="no-referrer" loading="lazy" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        <p className="text-slate-600 group-hover:text-slate-900 font-medium transition-colors">{job.company}</p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex px-5 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      Apply
                    </span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 items-center">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1.5 sm:ml-auto text-slate-400">
                      {job.posted}
                    </div>
                    <span className="sm:hidden w-full text-center mt-2 px-5 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      Apply
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-8 pb-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  Previous
                </button>
                <span className="text-slate-600 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
