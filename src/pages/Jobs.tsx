import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, DollarSign, Filter, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAuth } from '../context/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';

export const JOBS = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'TechCorp', location: 'San Francisco, CA', type: 'Full-time', salary: '$140k - $180k', posted: '2 days ago', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&h=128&fit=crop' },
  { id: 2, title: 'Product Designer', company: 'DesignStudio', location: 'Remote', type: 'Full-time', salary: '$110k - $150k', posted: '3 days ago', logo: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=128&h=128&fit=crop' },
  { id: 3, title: 'Backend Developer', company: 'DataSystems', location: 'New York, NY', type: 'Contract', salary: '$80 - $100 / hr', posted: '1 week ago', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop' },
  { id: 4, title: 'Marketing Manager', company: 'GrowthInc', location: 'Austin, TX', type: 'Full-time', salary: '$90k - $120k', posted: '2 weeks ago', logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&h=128&fit=crop' },
  { id: 5, title: 'DevOps Engineer', company: 'CloudScale', location: 'Remote', type: 'Full-time', salary: '$130k - $170k', posted: 'Just now', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&h=128&fit=crop' },
  { id: 6, title: 'Data Scientist', company: 'AI Solutions', location: 'Boston, MA', type: 'Full-time', salary: '$150k - $190k', posted: '3 weeks ago', logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&h=128&fit=crop' },
  { id: 7, title: 'Full Stack Developer', company: 'WebWorks', location: 'Seattle, WA', type: 'Full-time', salary: '$120k - $160k', posted: '1 day ago', logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&h=128&fit=crop' },
  { id: 8, title: 'UX Researcher', company: 'UserFirst', location: 'Remote', type: 'Contract', salary: '$60 - $80 / hr', posted: '4 days ago', logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&h=128&fit=crop' },
  { id: 9, title: 'Mobile App Developer', company: 'Appify', location: 'Los Angeles, CA', type: 'Full-time', salary: '$110k - $140k', posted: '5 days ago', logo: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=128&h=128&fit=crop' },
  { id: 10, title: 'Security Analyst', company: 'CyberShield', location: 'Washington, DC', type: 'Full-time', salary: '$100k - $130k', posted: '1 week ago', logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&h=128&fit=crop' },
  { id: 11, title: 'Cloud Architect', company: 'SkyNet Systems', location: 'Remote', type: 'Full-time', salary: '$160k - $200k', posted: '2 days ago', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&h=128&fit=crop' },
  { id: 12, title: 'Content Strategist', company: 'MediaMinds', location: 'Chicago, IL', type: 'Part-time', salary: '$50 - $70 / hr', posted: '3 days ago', logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=128&h=128&fit=crop' },
  { id: 13, title: 'Machine Learning Engineer', company: 'NeuralNet', location: 'San Francisco, CA', type: 'Full-time', salary: '$150k - $200k', posted: '1 week ago', logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&h=128&fit=crop' },
  { id: 14, title: 'HR Manager', company: 'PeopleFirst', location: 'Denver, CO', type: 'Full-time', salary: '$80k - $110k', posted: '2 weeks ago', logo: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=128&h=128&fit=crop' },
  { id: 15, title: 'Financial Analyst', company: 'CapitalGroup', location: 'New York, NY', type: 'Full-time', salary: '$90k - $120k', posted: '4 days ago', logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=128&h=128&fit=crop' },
  { id: 16, title: 'Sales Director', company: 'RevenueBoost', location: 'Remote', type: 'Full-time', salary: '$120k - $150k + Commission', posted: '1 day ago', logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&h=128&fit=crop' },
  { id: 17, title: 'Graphic Designer', company: 'PixelPerfect', location: 'Austin, TX', type: 'Contract', salary: '$40 - $60 / hr', posted: '5 days ago', logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=128&h=128&fit=crop' },
  { id: 18, title: 'Database Administrator', company: 'DataCore', location: 'Seattle, WA', type: 'Full-time', salary: '$110k - $140k', posted: '1 week ago', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop' },
  { id: 19, title: 'Customer Success Manager', company: 'ClientCare', location: 'Remote', type: 'Full-time', salary: '$70k - $90k', posted: '2 days ago', logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=128&h=128&fit=crop' },
  { id: 20, title: 'Technical Writer', company: 'DocuTech', location: 'Boston, MA', type: 'Part-time', salary: '$45 - $65 / hr', posted: '3 weeks ago', logo: 'https://images.unsplash.com/photo-1455390582262-044cdead27c8?w=128&h=128&fit=crop' },
  { id: 21, title: 'QA Engineer', company: 'TestPro', location: 'San Diego, CA', type: 'Full-time', salary: '$90k - $120k', posted: '2 days ago', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop' },
  { id: 22, title: 'Product Manager', company: 'InnovateNow', location: 'San Francisco, CA', type: 'Full-time', salary: '$130k - $170k', posted: '1 week ago', logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=128&h=128&fit=crop' },
  { id: 23, title: 'SEO Specialist', company: 'SearchRank', location: 'Remote', type: 'Contract', salary: '$50 - $75 / hr', posted: '4 days ago', logo: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=128&h=128&fit=crop' },
  { id: 24, title: 'Systems Administrator', company: 'NetOps', location: 'Dallas, TX', type: 'Full-time', salary: '$85k - $115k', posted: '1 day ago', logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=128&h=128&fit=crop' },
  { id: 25, title: 'Blockchain Developer', company: 'CryptoChain', location: 'Remote', type: 'Full-time', salary: '$150k - $190k', posted: '2 weeks ago', logo: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=128&h=128&fit=crop' },
];

export default function Jobs() {
  const { isJobSaved, toggleSavedJob } = useSavedJobs();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');

  const parsePostedDate = (posted: string) => {
    if (posted.toLowerCase() === 'just now') return 0;
    const match = posted.match(/(\d+)\s+(day|week|month|year)/i);
    if (!match) return 999;
    const val = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit === 'day') return val;
    if (unit === 'week') return val * 7;
    if (unit === 'month') return val * 30;
    if (unit === 'year') return val * 365;
    return val;
  };

  const sortedJobs = [...JOBS].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'company') return a.company.localeCompare(b.company);
    if (sortBy === 'location') return a.location.localeCompare(b.location);
    if (sortBy === 'date-desc') return parsePostedDate(a.posted) - parsePostedDate(b.posted);
    if (sortBy === 'date-asc') return parsePostedDate(b.posted) - parsePostedDate(a.posted);
    return 0;
  });

  const jobsPerPage = 10;
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = sortedJobs.slice(startIndex, startIndex + jobsPerPage);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSaveJob = (e: React.MouseEvent, jobId: number) => {
    e.preventDefault();
    if (isAuthenticated) {
      toggleSavedJob(jobId);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
                      <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-xl object-cover border border-slate-100" referrerPolicy="no-referrer" />
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
