import Hero from '../components/Hero';
import FeaturedJobs from '../components/FeaturedJobs';
import Categories from '../components/Categories';
import HowItWorks from '../components/HowItWorks';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const { isAuthenticated, role } = useAuth();



  return (
    <>
      <Hero />
      <FeaturedJobs />
      <Categories />
      <HowItWorks />
    </>
  );
}
