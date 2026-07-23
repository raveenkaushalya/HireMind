import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import JobListings from '../../components/JobListings';
import Features from '../../components/Features';
import Stats from '../../components/Stats';
import HowItWorks from '../../components/HowItWorks';
import About from '../../components/About';
import FAQ from '../../components/FAQ';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';
import AIChatbot from '../../components/AIChatbot';
import { useState } from 'react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar />
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchLocation={searchLocation} setSearchLocation={setSearchLocation} />
      <JobListings searchQuery={searchQuery} searchLocation={searchLocation} />
      <Features />
      <Stats />
      <HowItWorks />
      <About />
      <FAQ />
      <Contact />
      <Footer />
      <AIChatbot />
    </div>
  );
}