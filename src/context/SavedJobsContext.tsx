import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SavedJobsContextType {
  savedJobIds: string[];
  toggleSavedJob: (id: string) => void;
  isJobSaved: (id: string) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  // Load user-specific saved jobs
  useEffect(() => {
    if (user?._id) {
      const saved = localStorage.getItem(`savedJobs_${user._id}`);
      setSavedJobIds(saved ? JSON.parse(saved) : []);
    } else {
      setSavedJobIds([]);
    }
  }, [user?._id]);

  // Persist user-specific saved jobs
  useEffect(() => {
    if (user?._id) {
      localStorage.setItem(`savedJobs_${user._id}`, JSON.stringify(savedJobIds));
    }
  }, [savedJobIds, user?._id]);

  const toggleSavedJob = (id: string) => {
    if (!user) {
        alert('Please login to save jobs.');
        return;
    }
    setSavedJobIds(prev => 
      prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
    );
  };

  const isJobSaved = (id: string) => savedJobIds.includes(id);

  return (
    <SavedJobsContext.Provider value={{ savedJobIds, toggleSavedJob, isJobSaved }}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);
  if (context === undefined) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
}
