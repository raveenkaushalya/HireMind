import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import JobListings from '../../components/JobListings';
import Features from '../../components/Features';
import Stats from '../../components/Stats';
import HowItWorks from '../../components/HowItWorks';
import About from '../../components/About';
import Testimonials from '../../components/Testimonials';
import FAQ from '../../components/FAQ';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';
import AIChatbot from '../../components/AIChatbot';
export default function HomePage() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar />
      <Hero />
      <JobListings />
      <Features />
      <Stats />
      <HowItWorks />
      <About />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <AIChatbot />
    </div>
  );
}