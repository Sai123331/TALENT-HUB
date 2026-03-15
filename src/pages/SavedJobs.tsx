import { motion } from 'motion/react';
import { MapPin, Briefcase, DollarSign, Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JOBS } from './Jobs';
import { useSavedJobs } from '../context/SavedJobsContext';

export default function SavedJobs() {
  const { savedJobIds, toggleSavedJob } = useSavedJobs();
  const savedJobs = JOBS.filter(job => savedJobIds.includes(job.id));

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Jobs</h1>
          <p className="text-slate-600">Keep track of the opportunities you're interested in.</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No saved jobs yet</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              When you see a job you like, click the bookmark icon to save it here for later.
            </p>
            <Link 
              to="/jobs" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Browse Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job, index) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:shadow-indigo-100/50 hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSavedJob(job.id);
                  }}
                  className="absolute top-6 right-6 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors z-10"
                  aria-label="Remove from saved jobs"
                >
                  <Bookmark className="w-5 h-5 fill-current" />
                </button>

                <Link to={`/jobs/${job.id}`} className="block p-6 pr-20">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-xl object-cover border border-slate-100" referrerPolicy="no-referrer" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        <p className="text-slate-600 group-hover:text-slate-900 font-medium transition-colors">{job.company}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
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
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
