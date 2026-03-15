/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import SavedJobs from './pages/SavedJobs';
import CompanyDashboard from './pages/CompanyDashboard';
import PostJob from './pages/PostJob';
import ApplyJob from './pages/ApplyJob';
import Profile from './pages/Profile';
import { SavedJobsProvider } from './context/SavedJobsContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/jobs/:id/apply" element={<ApplyJob />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:id" element={<CompanyDetails />} />
                <Route path="/dashboard" element={<CompanyDashboard />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SavedJobsProvider>
    </AuthProvider>
  );
}
