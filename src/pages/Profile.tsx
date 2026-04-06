import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, LogOut, Briefcase, FileText, Lock, Loader2, Globe, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    industryType: user?.industryType || '',
    website: user?.website || '',
    location: user?.location || '',
    description: user?.description || '',
    password: ''
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        updateUser(data);
      }
    } catch (err) {
      console.error('Failed to sync profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        industryType: user.industryType || '',
        website: user.website || '',
        location: user.location || '',
        description: user.description || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === 'image') {
      setIsImageModalOpen(true);
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageUpdate = async (file?: File, url?: string) => {
    setUploadingImage(true);
    const formData = new FormData();
    if (file) {
      formData.append('profilePicture', file);
    } else if (url) {
      formData.append('profilePicture', url);
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/profile-picture', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          ...(url ? { 'Content-Type': 'application/json' } : {})
        },
        body: url ? JSON.stringify({ profilePicture: url }) : formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile picture');

      updateUser({ profilePicture: data.profilePicture });
      setIsImageModalOpen(false);
      setImageUrl('');
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const validateImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null || url.startsWith('https://');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ...(user?.role === 'user' 
            ? { firstName: formData.firstName, lastName: formData.lastName } 
            : { name: formData.name, industryType: formData.industryType }),
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          ...(user?.role === 'company' && {
            website: formData.website,
            location: formData.location,
            description: formData.description
          }),
          ...(formData.password ? { password: formData.password } : {})
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');

      updateUser(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      {/* Image Edit Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">Update Profile Image</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload from Device</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpdate(e.target.files[0])}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or use URL</span></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button
                    onClick={() => validateImageUrl(imageUrl) ? handleImageUpdate(undefined, imageUrl) : alert('Please enter a valid image URL')}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsImageModalOpen(false)}
                className="w-full py-2.5 text-slate-500 font-medium hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
          <p className="text-slate-500 mt-2">Manage your personal information and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center"
            >
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-indigo-50">
                {user?.profilePicture ? (
                  <img src={getImageUrl(user.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-indigo-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {user?.role === 'user' ? `${user?.firstName} ${user?.lastName}` : user?.name}
              </h2>
              <p className="text-sm text-slate-500 mb-6">{user?.email}</p>
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="w-full py-2.5 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
              >
                {uploadingImage ? 'Updating...' : 'Edit Image'}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-2">
                <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl transition-colors">
                  <User className="w-5 h-5" />
                  Personal Info
                </Link>
                {user?.role === 'user' && (
                  <>
                    <Link to="/applications" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <Briefcase className="w-5 h-5" />
                      My Applications
                    </Link>
                    <Link to="/resume" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <FileText className="w-5 h-5" />
                      Resume / CV
                    </Link>
                  </>
                )}
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
              <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {user?.role === 'user' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                 ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {user?.role === 'company' ? 'Company Name' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          placeholder="Enter full name"
                        />
                      </div>
                    </div>
                    {user?.role === 'company' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Industry Type</label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              id="industryType"
                              type="text"
                              value={formData.industryType}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                              placeholder="e.g. Software Development"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              id="website"
                              type="url"
                              value={formData.website}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              id="location"
                              type="text"
                              value={formData.location}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                              placeholder="e.g. New York, USA"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {user?.role === 'company' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Description</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <textarea
                        id="description"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm transition-shadow"
                        placeholder="Tell candidates about your company culture and mission..."
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                      id="phoneNumber"
                      type="text"
                      placeholder="e.g. +1 234 567 8900"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password (leave blank to keep current)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                {message.text && (
                  <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {message.text}
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
