import React, { createContext, useContext, useState, useEffect } from 'react';

interface SavedJobsContextType {
  savedJobIds: number[];
  toggleSavedJob: (id: number) => void;
  isJobSaved: (id: number) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const [savedJobIds, setSavedJobIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const toggleSavedJob = (id: number) => {
    setSavedJobIds(prev => 
      prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
    );
  };

  const isJobSaved = (id: number) => savedJobIds.includes(id);

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
