'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User, Clock, MessageSquare, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface SupportMessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportMessagesDrawer({ isOpen, onClose }: SupportMessagesDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user?.token) {
      fetchMessages();
    }
  }, [isOpen, user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://talent-hub-be.onrender.com/api/contacts', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch messages');
      
      setMessages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`https://talent-hub-be.onrender.com/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete message');

      setMessages(messages.filter(m => m._id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Support Messages
                </h2>
                <p className="text-sm text-slate-500 mt-1">Review inquiries from platform users</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
                  <p className="text-sm">Loading messages...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-semibold">No messages yet</h3>
                  <p className="text-slate-500 text-sm mt-1">When users contact you, they'll appear here.</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="divide-y divide-slate-100">
                    {messages.map((msg) => (
                      <div key={msg._id} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase shadow-sm">
                              {msg.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {msg.name}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                {msg.email}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-wider mb-2 border border-indigo-100/50">
                              {msg.subject}
                            </span>
                            <div className="text-[10px] font-medium text-slate-400 flex items-center justify-end gap-1 uppercase tracking-wider">
                              <Clock className="w-3 h-3" />
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-100 rounded-full"></div>
                          <p className="text-sm text-slate-600 leading-relaxed pl-4 py-1 italic">
                            "{msg.message}"
                          </p>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-4 py-2 rounded-xl transition-all border border-indigo-100 hover:border-indigo-600"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Reply via Email
                          </a>

                          <button
                            onClick={() => handleDelete(msg._id)}
                            disabled={deletingId === msg._id}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                            title="Delete Message"
                          >
                            {deletingId === msg._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
