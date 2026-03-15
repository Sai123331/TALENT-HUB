import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Building, Globe, Users, CheckCircle2, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { JOBS } from './Jobs';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAuth } from '../context/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = JOBS.find(j => j.id === Number(id));
  const { isJobSaved, toggleSavedJob } = useSavedJobs();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleSaveJob = () => {
    if (isAuthenticated) {
      if (job) toggleSavedJob(job.id);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleApply = () => {
    if (isAuthenticated) {
      navigate(`/jobs/${job?.id}/apply`);
    } else {
      setShowLoginPrompt(true);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Job not found</h2>
        <Link to="/jobs" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to all jobs
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {/* Header Section */}
          <div className="p-8 sm:p-10 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between mb-6">
              <div className="flex items-center gap-5">
                <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-lg text-slate-600 font-medium">
                    <Building className="w-5 h-5" />
                    {job.company}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleSaveJob}
                  className={`flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl transition-colors shadow-sm border ${
                    isJobSaved(job.id)
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isJobSaved(job.id) ? 'fill-current' : ''}`} />
                  {isJobSaved(job.id) ? 'Saved' : 'Save Job'}
                </button>
                <button 
                  onClick={handleApply}
                  className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors shadow-sm"
                >
                  Apply Now
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-8 text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400" />
                {job.location}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-400" />
                {job.type}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-slate-400" />
                {job.salary}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                Posted {job.posted}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">About the role</h2>
                <div className="prose prose-slate max-w-none text-slate-600">
                  <p>
                    We are looking for a passionate and experienced {job.title} to join our team at {job.company}. 
                    In this role, you will be responsible for designing, developing, and maintaining high-quality 
                    software solutions that solve complex business problems.
                  </p>
                  <p className="mt-4">
                    You will collaborate closely with cross-functional teams including product managers, designers, 
                    and other engineers to deliver exceptional user experiences. The ideal candidate is a self-starter 
                    who thrives in a fast-paced environment and is always eager to learn new technologies.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {[
                    'Design and implement scalable and robust software architecture.',
                    'Write clean, maintainable, and well-tested code.',
                    'Collaborate with product and design teams to define feature specifications.',
                    'Participate in code reviews and mentor junior engineers.',
                    'Identify and resolve performance bottlenecks and bugs.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {[
                    '5+ years of professional software development experience.',
                    'Strong proficiency in modern programming languages and frameworks.',
                    'Experience with cloud infrastructure and deployment pipelines.',
                    'Excellent problem-solving and analytical skills.',
                    'Strong communication and teamwork abilities.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">About {job.company}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <a href="#" className="hover:text-indigo-600 transition-colors">www.{job.company.toLowerCase()}.com</a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span>1,000 - 5,000 employees</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Building className="w-5 h-5 text-slate-400" />
                    <span>Technology / Software</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    {job.company} is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
