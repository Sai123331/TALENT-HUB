import { motion } from 'motion/react';
import { Code, PenTool, TrendingUp, Database, MonitorSmartphone, Headset, Briefcase, Calculator } from 'lucide-react';

const CATEGORIES = [
  { name: 'Development', icon: Code, count: '1,200+' },
  { name: 'Design', icon: PenTool, count: '850+' },
  { name: 'Marketing', icon: TrendingUp, count: '640+' },
  { name: 'Data Science', icon: Database, count: '420+' },
  { name: 'Mobile Dev', icon: MonitorSmartphone, count: '380+' },
  { name: 'Customer Support', icon: Headset, count: '950+' },
  { name: 'Business', icon: Briefcase, count: '530+' },
  { name: 'Finance', icon: Calculator, count: '290+' },
];

export default function Categories() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Popular Categories</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Explore thousands of job opportunities across various industries and find the perfect role for your skills.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all cursor-pointer group text-center"
              >
                <div className="w-12 h-12 mx-auto bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                <p className="text-sm text-slate-500">{category.count} jobs</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
