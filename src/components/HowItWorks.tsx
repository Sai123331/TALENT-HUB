import { motion } from 'motion/react';
import { UserPlus, SearchCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create an Account',
    description: 'Sign up in seconds and complete your profile to stand out to employers.',
  },
  {
    icon: SearchCheck,
    title: 'Search for Jobs',
    description: 'Browse thousands of job listings or use our smart matching algorithm.',
  },
  {
    icon: CheckCircle2,
    title: 'Apply and Get Hired',
    description: 'Apply with one click and track your applications until you land the job.',
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">How TALENT HUB Works</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Your journey to a new career is just three simple steps away. We make job hunting effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-300 to-indigo-100 z-0" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-white rounded-full shadow-xl shadow-indigo-100/50 flex items-center justify-center mb-8 border-4 border-indigo-50 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {index + 1}
                  </div>
                  <Icon className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-medium text-lg transition-colors shadow-xl shadow-slate-900/20"
          >
            Get Started Now
          </motion.button>
        </div>
      </div>
    </section>
  );
}
