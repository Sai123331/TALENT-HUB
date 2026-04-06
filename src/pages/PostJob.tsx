import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Building, AlignLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.role === 'company' ? user._id : '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    experience: 'Entry Level',
    responsibilities: '',
    requirements: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchCompanies = async () => {
        try {
          const res = await fetch('https://talent-hub-be.onrender.com/api/companies');
          const data = await res.json();
          setCompanies(data);
        } catch (err) {
          console.error('Failed to fetch companies');
        }
      };
      fetchCompanies();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('https://talent-hub-be.onrender.com/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ...formData,
          responsibilities: formData.responsibilities.split('\n').filter(line => line.trim() !== ''),
          requirements: formData.requirements.split('\n').filter(line => line.trim() !== '')
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post job');
      }

      setIsSuccess(true);
      setTimeout(() => {
        navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Post a New Job</h1>
          <p className="text-slate-600 mt-2">Fill out the details below to publish a new job listing to the board.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {isSuccess ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Posted Successfully!</h2>
              <p className="text-slate-600">Redirecting you back to the dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                    Job Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-shadow"
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>
                </div>

                {/* Company Selection (for Admin) */}
                {user?.role === 'admin' ? (
                  <div className="md:col-span-2">
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">
                      Select Company
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-slate-400" />
                        </div>
                        <select
                            id="company"
                            required
                            value={formData.company}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-shadow bg-white"
                        >
                            <option value="">Select a company</option>
                            {companies.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                  </div>
                ) : null}

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-shadow"
                      placeholder="e.g. San Francisco, CA or Remote"
                    />
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
                    Job Type
                  </label>
                  <select
                    id="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-shadow bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-slate-700 mb-1">
                    Salary Range
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="salary"
                      required
                      value={formData.salary}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-shadow"
                      placeholder="e.g. $120k - $150k"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    id="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-shadow bg-white"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Associate">Associate</option>
                    <option value="Mid-Senior">Mid-Senior</option>
                    <option value="Director">Director</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                    Job Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <AlignLeft className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea
                      id="description"
                      rows={6}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-shadow resize-y"
                      placeholder="Describe the role, responsibilities, and requirements..."
                    ></textarea>
                  </div>
                </div>

                {/* Key Responsibilities */}
                <div className="md:col-span-2">
                  <label htmlFor="responsibilities" className="block text-sm font-medium text-slate-700 mb-1">
                    Key Responsibilities
                  </label>
                  <p className="text-xs text-slate-500 mb-2 italic">Enter each responsibility on a new line.</p>
                  <textarea
                    id="responsibilities"
                    rows={4}
                    required
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="block w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-shadow resize-y"
                    placeholder="• Design software architecture&#10;• Write clean code&#10;• Mentor junior engineers..."
                  ></textarea>
                </div>

                {/* Requirements */}
                <div className="md:col-span-2">
                  <label htmlFor="requirements" className="block text-sm font-medium text-slate-700 mb-1">
                    Requirements
                  </label>
                  <p className="text-xs text-slate-500 mb-2 italic">Enter each requirement on a new line.</p>
                  <textarea
                    id="requirements"
                    rows={4}
                    required
                    value={formData.requirements}
                    onChange={handleChange}
                    className="block w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-shadow resize-y"
                    placeholder="• 5+ years experience in React&#10;• Proficiency in Node.js&#10;• Excellent problem solving skills..."
                  ></textarea>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post Job'
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
