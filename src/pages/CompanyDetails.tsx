import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Users, Briefcase, Globe, Twitter, Linkedin, ArrowLeft, DollarSign } from 'lucide-react';
import { COMPANIES } from './Companies';
import { JOBS } from './Jobs';

export default function CompanyDetails() {
  const { id } = useParams();
  const company = COMPANIES.find(c => c.id === Number(id));

  if (!company) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Company not found</h2>
        <Link to="/companies" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </Link>
      </div>
    );
  }

  const companyJobs = JOBS.filter(job => job.company === company.name);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/companies" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </Link>

        {/* Company Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute -bottom-12 left-8 p-2 bg-white rounded-2xl shadow-md">
              <img src={company.logo} alt={company.name} className="w-24 h-24 rounded-xl object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{company.name}</h1>
              <p className="text-lg text-indigo-600 font-medium mb-4">{company.industry}</p>
              
              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  {company.employees} employees
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a href="#" className="hover:text-indigo-600 transition-colors">www.{company.name.toLowerCase().replace(/\s+/g, '')}.com</a>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                Follow Company
              </button>
              <a href="#" className="p-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About {company.name}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {company.description}
              </p>
              <p className="text-slate-600 leading-relaxed">
                We are a team of passionate individuals dedicated to building products that make a difference. 
                Our culture is built on collaboration, innovation, and a shared commitment to excellence. 
                Join us and help shape the future of our industry.
              </p>
            </section>

            {/* Open Jobs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Open Positions</h2>
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                  {companyJobs.length} Jobs
                </span>
              </div>
              
              <div className="space-y-4">
                {companyJobs.length > 0 ? (
                  companyJobs.map((job, index) => (
                    <motion.div 
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-100 transition-all group"
                    >
                      <Link to={`/jobs/${job.id}`} className="block">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {job.title}
                          </h3>
                          <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                            View Details
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
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
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                    <p className="text-slate-500">No open positions at the moment.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Company Overview</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500">Founded</span>
                  <span className="font-medium text-slate-900">2010</span>
                </li>
                <li className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500">Company Size</span>
                  <span className="font-medium text-slate-900">{company.employees}</span>
                </li>
                <li className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500">Industry</span>
                  <span className="font-medium text-slate-900">{company.industry}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-slate-500">Headquarters</span>
                  <span className="font-medium text-slate-900">{company.location}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
