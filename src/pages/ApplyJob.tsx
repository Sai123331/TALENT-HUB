import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, UploadCloud, CheckCircle2, FileText, User, Briefcase, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { id: 1, name: 'Personal Info', icon: User },
  { id: 2, name: 'Resume & Cover Letter', icon: FileText },
  { id: 3, name: 'Review', icon: CheckCircle2 },
];

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resumeName: '',
    coverLetter: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/jobs/${id}`);
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
        if (!response.ok) throw new Error('Job not found');
        const data = await response.json();
        setJob({
            ...data,
            id: data._id,
            company: data.company?.name || 'Unknown Company'
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [isAuthenticated, navigate, id]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        resumeName: user.resume ? user.resume.split('/').pop() || '' : '',
        coverLetter: user.summary || ''
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-slate-500">
        <p>{error || 'Job not found.'}</p>
      </div>
    );
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          jobId: id,
          resume: user?.resume || 'resume.pdf',
          coverLetter: formData.coverLetter
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setStep(2); // Go back to fix issues
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resumeName: e.target.files[0].name });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-600 mb-8">
            Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been successfully sent.
          </p>
          <Link 
            to="/jobs" 
            className="block w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Browse More Jobs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to={`/jobs/${job.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Job Details
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Apply for {job.title}</h1>
          <p className="text-slate-600 mt-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> {job.company} &bull; {job.location}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full -z-10 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCurrent = step === s.id;
              
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'bg-white border-slate-300 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}>
                    {step > s.id ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-indigo-900' : 'text-slate-500'}`}>
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleNext}>
            <div className="p-6 sm:p-8">
              
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input 
                        type="text" required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input 
                        type="text" required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Resume & Cover Letter */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Resume & Cover Letter</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Resume / CV</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required={!formData.resumeName}
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        {formData.resumeName ? (
                          <p className="text-sm font-medium text-indigo-600">{formData.resumeName}</p>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-500">PDF, DOC, DOCX (Max 5MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Profetional Summary</label>
                    <textarea 
                      rows={6} required
                      value={formData.coverLetter}
                      onChange={e => setFormData({...formData, coverLetter: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-y"
                      placeholder="Tell us why you're a great fit for this role..."
                    ></textarea>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Review Your Application</h2>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-6 border border-slate-100">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Personal Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1">Full Name</p>
                          <p className="font-medium text-slate-900">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Email</p>
                          <p className="font-medium text-slate-900">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Phone</p>
                          <p className="font-medium text-slate-900">{formData.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Documents</h3>
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1">Resume</p>
                          <p className="font-medium text-indigo-600 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {formData.resumeName}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Cover Letter</p>
                          <p className="font-medium text-slate-900 line-clamp-3 bg-white p-3 rounded-lg border border-slate-200 mt-1">
                            {formData.coverLetter}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div></div> // Empty div for flex spacing
              )}
              
              {step < 3 ? (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
