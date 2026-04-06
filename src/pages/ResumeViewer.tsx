import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, CheckCircle, XCircle, User, Mail, Phone, Briefcase, FileText, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

export default function ResumeViewer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://talent-hub-be.onrender.com/api/applications/company/${user?._id}`, {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch application details');
        const data = await response.json();
        const found = data.find((app: any) => app._id === id);
        if (!found) throw new Error('Application not found');
        setApplication(found);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchApplication();
  }, [id, user]);

  const handleStatusUpdate = async (status: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`https://talent-hub-be.onrender.com/api/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      setApplication({ ...application, status });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 pt-20">
        <XCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Resume</h2>
        <p className="text-slate-500 mb-6">{error || 'Could not find the requested application.'}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/20">
          Go Back
        </button>
      </div>
    );
  }

  const resumePath = application.resume.startsWith('/uploads/') 
    ? application.resume 
    : `/uploads/resumes/${application.resume}`;
  const resumeUrl = `https://talent-hub-be.onrender.com${resumePath}`;
  const isPdf = application.resume.toLowerCase().endsWith('.pdf');

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden pt-20">
      {/* Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <div className="min-w-0">
            <h1 className="text-slate-900 font-bold text-sm sm:text-base truncate">
              {application.applicant?.firstName} {application.applicant?.lastName}
            </h1>
            <p className="text-slate-500 text-xs truncate font-medium">Applied for: {application.job?.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
            application.status === 'Hired' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
            application.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
            'bg-indigo-50 text-indigo-700 border-indigo-100'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              application.status === 'Hired' ? 'bg-emerald-500' :
              application.status === 'Rejected' ? 'bg-rose-500' :
              'bg-indigo-500'
            }`} />
            {application.status}
          </div>
          
          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          <a 
            href={resumeUrl} 
            download 
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-indigo-600 transition-colors border border-slate-200"
            title="Download Resume"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Resume Viewer */}
        <div className="flex-1 bg-slate-200/50 p-4 sm:p-8 relative overflow-hidden flex flex-col items-center overflow-y-auto">
          {isPdf ? (
            <div className="w-full h-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <iframe 
                src={`${resumeUrl}#toolbar=0&navpanes=0`} 
                className="w-full h-full border-none"
                title="Resume Document"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 my-auto h-fit">
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-6 border border-amber-100">
                <FileText className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Native View Unsupported</h3>
              <p className="text-slate-500 mb-8">
                This document is not a PDF. For your safety and better viewing experience, please download the file to review it.
              </p>
              <a 
                href={resumeUrl} 
                download 
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </a>
            </div>
          )}
        </div>

        {/* Sidebar Info/Actions */}
        <aside className="w-80 bg-white border-l border-slate-200 hidden lg:flex flex-col p-6 overflow-y-auto shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="mb-8">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Candidate Overview</h4>
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center overflow-hidden shadow-md shadow-indigo-600/20">
                {application.applicant?.profilePicture ? (
                   <img src={getImageUrl(application.applicant.profilePicture)} className="w-full h-full object-cover" alt="" />
                ) : (
                   <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm">{application.applicant?.firstName} {application.applicant?.lastName}</p>
                <p className="text-slate-500 text-[10px] font-medium leading-tight">Applied: {new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-5 px-1">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                   <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Contact Email</p>
                  <p className="text-slate-700 text-xs font-medium truncate">{application.applicant?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                   <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Phone Number</p>
                  <p className="text-slate-700 text-xs font-medium">{application.applicant?.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                   <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Job Applied For</p>
                  <p className="text-slate-700 text-xs font-bold leading-snug">{application.job?.title}</p>
                </div>
              </div>
            </div>
          </div>

          {application.coverLetter && (
            <div className="mb-8">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Candidate Statement</h4>
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{application.coverLetter}"
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-3">
             <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Review Status</h4>
             <button
              onClick={() => handleStatusUpdate('Hired')}
              disabled={updating || application.status === 'Hired'}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border shadow-sm ${
                application.status === 'Hired' 
                ? 'bg-emerald-500 text-white border-emerald-500' 
                : 'bg-white hover:bg-emerald-50 outline-emerald-100 text-emerald-600 border-emerald-200'
              } disabled:opacity-70`}
            >
              <CheckCircle className="w-4 h-4" />
              {updating ? 'Updating...' : application.status === 'Hired' ? 'Candidate Hired' : 'Hire Candidate'}
            </button>
             <button
              onClick={() => handleStatusUpdate('Rejected')}
              disabled={updating || application.status === 'Rejected'}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border shadow-sm ${
                application.status === 'Rejected' 
                ? 'bg-rose-500 text-white border-rose-500' 
                : 'bg-white hover:bg-rose-50 border-rose-200 text-rose-600'
              } disabled:opacity-70`}
            >
              <XCircle className="w-4 h-4" />
              {updating ? 'Updating...' : application.status === 'Rejected' ? 'Application Rejected' : 'Reject Application'}
            </button>
             <div className="pt-2">
                <p className="text-[9px] text-center text-slate-400 leading-tight">
                   Status updates will notify the applicant immediately via their dashboard.
                </p>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
