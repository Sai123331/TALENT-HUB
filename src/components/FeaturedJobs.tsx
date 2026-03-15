import { motion } from 'motion/react';
import { MapPin, Clock, DollarSign, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechNova',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&h=128&fit=crop',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    posted: '2 days ago',
    tags: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'CreativeFlow',
    logo: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=128&h=128&fit=crop',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90k - $120k',
    posted: '1 day ago',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'DataSync',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop',
    location: 'New York, NY',
    type: 'Contract',
    salary: '$80 - $100 / hr',
    posted: '5 hours ago',
    tags: ['Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: 4,
    title: 'Marketing Manager',
    company: 'GrowthLabs',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&h=128&fit=crop',
    location: 'London, UK',
    type: 'Full-time',
    salary: '£60k - £80k',
    posted: '3 days ago',
    tags: ['SEO', 'Content', 'Analytics'],
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'AI Solutions',
    logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&h=128&fit=crop',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130k - $160k',
    posted: 'Just now',
    tags: ['Python', 'Machine Learning', 'SQL'],
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    company: 'CloudScale',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&h=128&fit=crop',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110k - $140k',
    posted: '1 week ago',
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
  },
];

export default function FeaturedJobs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Jobs</h2>
            <p className="text-slate-600 text-lg">Discover the latest opportunities from top companies.</p>
          </div>
          <a href="#" className="hidden md:inline-flex items-center font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            View all jobs &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {JOBS.map((job, index) => (
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
                    <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
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
          <button className="w-full py-3 px-6 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors">
            View all jobs
          </button>
        </div>
      </div>
    </section>
  );
}
