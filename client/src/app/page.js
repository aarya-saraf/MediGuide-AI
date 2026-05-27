import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Footer />
      </main>

    </div>
  );
}
