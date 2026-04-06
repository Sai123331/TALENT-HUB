import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, LogOut, Upload, File, Briefcase, FileText, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Resume() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(user?.summary || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.summary) {
      setSummary(user.summary);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveSummary = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch('https://talent-hub-be.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ summary })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update summary');

      updateUser(data);
      setMessage({ type: 'success', text: 'Summary saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('https://talent-hub-be.onrender.com/api/users/resume', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload resume');

      updateUser({ resume: data.resume });
      alert('Resume uploaded successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Resume / CV</h1>
          <p className="text-slate-500 mt-2">Manage your resume and professional experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden border border-indigo-50 shrink-0">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture.startsWith('http') ? user.profilePicture : `https://talent-hub-be.onrender.com${user.profilePicture}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 text-indigo-600" />
                  )}
                </div>
                <div className="text-left overflow-hidden">
                  <h2 className="text-xl font-bold text-slate-900 truncate">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-sm text-slate-500 truncate mb-2">{user?.email}</p>

                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-2">
                <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <UserIcon className="w-5 h-5" />
                  Personal Info
                </Link>
                <Link to="/applications" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <Briefcase className="w-5 h-5" />
                  My Applications
                </Link>
                <Link to="/resume" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl transition-colors">
                  <FileText className="w-5 h-5" />
                  Resume / CV
                </Link>
                <div className="h-px bg-slate-100 my-2 mx-4"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Upload Resume</h3>

              <label className="relative block border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-indigo-600" />
                  )}
                </div>
                <h4 className="text-slate-900 font-medium mb-1">
                  {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </h4>
                <p className="text-slate-500 text-sm">PDF, DOCX, or TXT (max. 5MB)</p>
              </label>

              {user?.resume && (
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Current Resume</h4>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 truncate max-w-[150px] sm:max-w-xs">{user.resume.split('/').pop()}</p>
                        <p className="text-xs text-slate-500">Resume uploaded</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://talent-hub-be.onrender.com${user.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Professional Summary</h4>
                <textarea
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[120px] resize-y"
                  placeholder="Write a brief summary of your professional background and goals..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                ></textarea>

                {message.text && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {message.text}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveSummary}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Summary
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
