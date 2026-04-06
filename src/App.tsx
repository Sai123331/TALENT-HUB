/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { SavedJobsProvider } from './context/SavedJobsContext';
import { AuthProvider } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Jobs = lazy(() => import('./pages/Jobs'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const Companies = lazy(() => import('./pages/Companies'));
const CompanyDetails = lazy(() => import('./pages/CompanyDetails'));
const SavedJobs = lazy(() => import('./pages/SavedJobs'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const PostJob = lazy(() => import('./pages/PostJob'));
const ApplyJob = lazy(() => import('./pages/ApplyJob'));
const Profile = lazy(() => import('./pages/Profile'));
const MyApplications = lazy(() => import('./pages/MyApplications'));
const Resume = lazy(() => import('./pages/Resume'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminCompanies = lazy(() => import('./pages/AdminCompanies'));
const AdminAddCompany = lazy(() => import('./pages/AdminAddCompany'));
const AdminJobs = lazy(() => import('./pages/AdminJobs'));

const Contact = lazy(() => import('./pages/Contact'));
const ManageApplicants = lazy(() => import('./pages/ManageApplicants'));
const ResumeViewer = lazy(() => import('./pages/ResumeViewer'));

export default function App() {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/jobs/:id/apply" element={<ApplyJob />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/companies/:id" element={<CompanyDetails />} />
                  <Route path="/dashboard" element={<CompanyDashboard />} />
                  <Route path="/dashboard/applicants" element={<ManageApplicants />} />
                  <Route path="/dashboard/applicants/:id/resume" element={<ResumeViewer />} />
                  <Route path="/post-job" element={<PostJob />} />
                  <Route path="/saved-jobs" element={<SavedJobs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/applications" element={<MyApplications />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/companies" element={<AdminCompanies />} />
                  <Route path="/admin/add-company" element={<AdminAddCompany />} />
                  <Route path="/admin/jobs" element={<AdminJobs />} />

                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </SavedJobsProvider>
    </AuthProvider>
  );
}
