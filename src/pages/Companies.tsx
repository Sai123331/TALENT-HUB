import { motion } from 'motion/react';
import { Search, MapPin, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export const COMPANIES = [
  { id: 1, name: 'TechCorp', industry: 'Software Development', location: 'San Francisco, CA', employees: '1000-5000', openJobs: 12, logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&h=128&fit=crop', description: 'Leading the way in enterprise software solutions.' },
  { id: 2, name: 'DesignStudio', industry: 'Design', location: 'Remote', employees: '50-200', openJobs: 4, logo: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=128&h=128&fit=crop', description: 'Award-winning digital design and branding agency.' },
  { id: 3, name: 'DataSystems', industry: 'Data Analytics', location: 'New York, NY', employees: '500-1000', openJobs: 8, logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop', description: 'Empowering businesses with data-driven insights.' },
  { id: 4, name: 'GrowthInc', industry: 'Marketing', location: 'Austin, TX', employees: '200-500', openJobs: 5, logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&h=128&fit=crop', description: 'Innovative marketing strategies for modern brands.' },
  { id: 5, name: 'CloudScale', industry: 'Cloud Computing', location: 'Remote', employees: '1000-5000', openJobs: 15, logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&h=128&fit=crop', description: 'Scalable cloud infrastructure for the next generation.' },
  { id: 6, name: 'AI Solutions', industry: 'Artificial Intelligence', location: 'Boston, MA', employees: '50-200', openJobs: 6, logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&h=128&fit=crop', description: 'Pioneering AI research and practical applications.' },
];

export default function Companies() {
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
          {COMPANIES.map((company, index) => (
            <motion.div 
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer flex flex-col h-full"
            >
              <Link to={`/companies/${company.id}`} className="flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100" referrerPolicy="no-referrer" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium">{company.industry}</p>
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
