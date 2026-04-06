import { motion } from 'motion/react';
import { MapPin, Clock, DollarSign, Bookmark, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        // Just take the first 6 for featured
        const featured = data.slice(0, 6).map((job: any) => ({
            ...job,
            id: job._id,
            company: job.company?.name || 'Unknown Company',
            logo: job.company?.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&h=128&fit=crop',
            tags: [job.type, job.location.split(',')[0]]
        }));
        setJobs(featured);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Or show error
  }
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Jobs</h2>
            <p className="text-slate-600 text-lg">Discover the latest opportunities from top companies.</p>
          </div>
          <Link to="/jobs" className="hidden md:inline-flex items-center font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            View all jobs &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-white border border-slate-200 rounded-2xl hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all flex flex-col h-full relative overflow-hidden"
            >
              <button className="absolute top-6 right-6 z-10 text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
                <Bookmark className="w-5 h-5" />
              </button>

              <Link to={`/jobs/${job.id}`} className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6 pr-10">
                  <div className="flex items-center gap-4">
                    <img src={getImageUrl(job.logo, 'company')} alt={job.company} className="w-12 h-12 rounded-xl object-cover border border-slate-100" loading="lazy" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.company}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                    {job.salary}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    Apply
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link to="/jobs" className="block w-full py-3 px-6 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors">
            View all jobs
          </Link>
        </div>
      </div>
    </section>
  );
}
