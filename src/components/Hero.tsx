import { motion } from 'motion/react';
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-[1.1]">
              AI JOB MARKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AND</span> DEMAND SEARCH
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Connect with top companies and discover opportunities that match your skills, experience, and aspirations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-2 md:p-3 rounded-2xl md:rounded-full shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-3 md:gap-0"
          >
            <div className="flex-1 flex items-center px-4 py-2">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Job title, keyword, or company"
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 md:py-4 rounded-xl md:rounded-full font-medium transition-colors shrink-0">
              Search Jobs
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm text-slate-500"
          >
            <span>Popular searches:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Frontend Developer', 'Product Manager', 'UX Designer', 'Data Scientist'].map((tag) => (
                <a key={tag} href="#" className="hover:text-indigo-600 transition-colors">
                  {tag}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
