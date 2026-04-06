import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

export default function Contact() {
  const [formStatus, setFormStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [adminContact, setAdminContact] = useState({
    name: 'Talent Hub Support',
    email: 'support@talenthub.com',
    phoneNumber: '+91 8888899999'
  });

  React.useEffect(() => {
    const fetchAdminContact = async () => {
      try {
        const response = await fetch('https://talent-hub-be.onrender.com/api/admin/contact');
        if (response.ok) {
          const data = await response.json();
          setAdminContact(data);
        }
      } catch (err) {
        console.error('Failed to fetch admin contact info', err);
      }
    };
    fetchAdminContact();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Support',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus({ type: '', text: '' });

    try {
      const response = await fetch('https://talent-hub-be.onrender.com/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      setFormStatus({ type: 'success', text: 'Thank you for contacting us! We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: 'General Support', message: '' });
    } catch (err: any) {
      setFormStatus({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500 text-indigo-100 text-xs font-semibold mb-6 uppercase tracking-wider"
          >
            <MessageSquare className="w-3 h-3" />
            Contact US
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            How can we help you?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-100 text-lg max-w-2xl mx-auto"
          >
            Have questions about our platform or need assistance with your recruitment? 
            Our team is here to provide support and guidance.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-500 text-sm mb-4">Our support team is available via email for any inquiries.</p>
              <a href={`mailto:${adminContact.email}`} className="text-indigo-600 font-medium hover:underline flex items-center gap-2 text-sm break-all">
                {adminContact.email}
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Call Us</h3>
              <p className="text-slate-500 text-sm mb-4">Direct support for urgent matters during business hours.</p>
              <a href={`tel:${adminContact.phoneNumber}`} className="text-emerald-600 font-medium hover:underline flex items-center gap-2">
                {adminContact.phoneNumber}
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Support Hours</h3>
              <p className="text-slate-500 text-sm">
                Monday - Friday: 9am - 6pm EST<br />
                Saturday: 10am - 4pm EST<br />
                Sunday: Closed
              </p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
            
            {formStatus.text && (
              <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${formStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                <CheckCircle className="w-5 h-5 shrink-0" />
                {formStatus.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow"
                >
                  <option value="General Support">General Support</option>
                  <option value="Business Inquiries">Business Inquiries</option>
                  <option value="Job Applicant Support">Job Applicant Support</option>
                  <option value="Employer Support">Employer Support</option>
                  <option value="Technical Issue">Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  {!loading && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
