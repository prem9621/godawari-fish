import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Sparkles, ArrowRight, Star } from 'lucide-react';
import DailyRates from '../components/DailyRates';
import ReviewsSection from '../components/ReviewsSection';
import ServicesSection from '../components/ServicesSection';
import BubbleBackground from '../components/BubbleBackground';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedStat from '../components/AnimatedStat';

const SplashScreen = ({ onDone }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHide(true), 2800);
    const t2 = setTimeout(() => onDone(), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-900 transition-opacity duration-500 ${
        hide ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <BubbleBackground count={18} />
      <div className="relative z-10 flex flex-col items-center gap-6 animate-bounce-in">
        <img
          src="/godawari_logo.png"
          alt="Godawari Fish & Company"
          className="h-40 w-auto drop-shadow-2xl animate-float"
        />
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Godawari Fish
          </h1>
          <p className="text-cyan-200 font-bold text-xl tracking-widest uppercase mt-1">
            & Company
          </p>
          <p className="text-white/80 text-lg mt-3 italic">
            "The Real Taste of Fresh Fish"
          </p>
        </div>
        <div className="flex gap-1 mt-2">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem('splashShown') === 'true'
  );

  const handleSplashDone = () => {
    sessionStorage.setItem('splashShown', 'true');
    setSplashDone(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white py-24 animate-gradient">
        <BubbleBackground count={22} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="slide-left">
              {/* Logo in hero */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/godawari_logo.png"
                  alt="Godawari Fish & Company"
                  className="h-20 w-auto drop-shadow-xl animate-float"
                />
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Godawari Fish</h2>
                  <p className="text-cyan-200 font-semibold text-sm tracking-widest uppercase">& Company</p>
                  <p className="text-white/80 text-sm italic mt-1">"The Real Taste of Fresh Fish"</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 reveal">
                <Sparkles size={16} className="text-yellow-300" />
                <span>Fresh catch – delivered daily</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Fresh & Premium{' '}
                <span className="bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent">
                  Quality Seafood
                </span>
              </h1>
              <p className="text-xl mb-8 text-blue-50/90 leading-relaxed">
                Experience the finest fresh fish and seafood, delivered daily from
                trusted suppliers. Quality assured, hygienically processed, and
                available for retail and wholesale.
              </p>

              <div className="flex gap-4 flex-wrap">
                <a
                  href="/shop"
                  className="btn-glow ripple flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition transform hover:scale-105 shadow-lg"
                >
                  🛒 Browse Our Fish
                  <ArrowRight size={18} />
                </a>
                <a
                  href="https://wa.me/919371306189?text=Hi%20Godawari%20Fish%20%26%20Company%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow ripple flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
                >
                  <MessageCircle size={20} />
                  Order on WhatsApp
                </a>
                <a
                  href="tel:9371306189"
                  className="btn-glow ripple flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-full font-semibold transition transform hover:scale-105"
                >
                  <Phone size={20} />
                  Call Now
                </a>
              </div>
            </div>

            <ScrollReveal className="relative slide-right" delay={200}>
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-300/40 to-blue-500/40 rounded-3xl blur-2xl animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-br from-blue-500/90 to-cyan-600/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl hover-wiggle">
                <p className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles size={22} className="text-yellow-300 animate-float" />
                  Why Choose Us?
                </p>
                <ul className="space-y-3 text-blue-50">
                  {[
                    'Fresh catch delivered daily',
                    'Hygienic cutting & cleaning',
                    'Quality assured products',
                    'Wholesale & retail available',
                    'Trusted local supplier',
                    'Fast WhatsApp ordering',
                    '40+ varieties of fish available',
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 reveal"
                      style={{ animationDelay: `${0.1 * i}s` }}
                    >
                      <span className="text-yellow-300">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Wave SVG divider */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg className="block w-full h-16 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Trusted by <span className="gradient-text">Hundreds</span> of Families
            </h2>
            <p className="text-gray-600 text-lg">
              Numbers that speak for our commitment to freshness
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedStat value="15+" label="Years Experience" delay={0} />
            <AnimatedStat value="100%" label="Fresh Daily" delay={150} />
            <AnimatedStat value="500+" label="Happy Customers" delay={300} />
            <AnimatedStat value="40+" label="Fish Varieties" delay={450} />
          </div>
        </div>
      </section>

      {/* Shop CTA Banner */}
      <section className="py-10 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800">🐟 Explore Our Full Fish Menu</h3>
            <p className="text-gray-600 mt-1">40+ varieties – sea fish, fresh water fish & seafood. Order directly via WhatsApp!</p>
          </div>
          <a
            href="/shop"
            className="btn-glow bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105 shadow-lg whitespace-nowrap"
          >
            View All Fish →
          </a>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Daily Rates */}
      <DailyRates />

      {/* Reviews */}
      <ReviewsSection />

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-800 text-white animate-gradient">
        <BubbleBackground count={14} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Ready to Order{' '}
              <span className="bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent">
                Fresh Fish?
              </span>
            </h2>
            <p className="text-xl mb-8 text-blue-50/90">
              Contact Godawari Fish & Company on WhatsApp or call to place your order
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://wa.me/919371306189"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow ripple bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-full font-semibold transition transform hover:scale-110 shadow-xl hover:shadow-green-500/60 animate-pulse-glow"
              >
                💬 Chat on WhatsApp
              </a>
              <a
                href="tel:9371306189"
                className="btn-glow ripple bg-white hover:bg-gray-100 text-blue-600 px-8 py-3.5 rounded-full font-semibold transition transform hover:scale-110 shadow-xl"
              >
                📞 Call 9371306189
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
