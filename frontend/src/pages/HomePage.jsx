import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Sparkles, ArrowRight, Star } from 'lucide-react';
import DailyRates from '../components/DailyRates';
import ReviewsSection from '../components/ReviewsSection';
import ServicesSection from '../components/ServicesSection';
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-green-700 via-emerald-600 to-green-900 transition-opacity duration-500 ${
        hide ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
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
          <p className="text-emerald-200 font-bold text-xl tracking-widest uppercase mt-1">
            & Company
          </p>
          <p className="text-white/80 text-lg mt-3 italic">
            "The Real Taste of Fresh Fish"
          </p>
        </div>
      </div>
    </div>
  );
};

const ProductCategory = ({ title, image, delay }) => (
  <ScrollReveal delay={delay} className="group relative overflow-hidden rounded-3xl shadow-xl glow-card pop-hover">
    <img
      src={image}
      alt={title}
      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
      <a
        href="/shop"
        className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold transition btn-glow ripple shake"
      >
        View Products
        <ArrowRight size={16} />
      </a>
    </div>
  </ScrollReveal>
);

const HomePage = () => {
  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem('splashShown') === 'true'
  );
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);

  const videos = [
    "https://cdn.pixabay.com/video/2024/08/18/227132_medium.mp4",
    "https://cdn.pixabay.com/video/2024/08/18/227128_medium.mp4",
    "https://cdn.pixabay.com/video/2019/03/31/22476-328008668_medium.mp4"
  ];

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.play();
    }
  }, [currentVideoIndex]);

  const handleSplashDone = () => {
    sessionStorage.setItem('splashShown', 'true');
    setSplashDone(true);
  };

  const categories = [
    {
      title: 'SEA FISH',
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=600&fit=crop'
    },
    {
      title: 'FRESH WATER FISH',
      image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&h=600&fit=crop'
    },
    {
      title: 'SEAFOOD',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop'
    },
    {
      title: 'FROZEN FISH',
      image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&h=600&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      {/* Hero Section with Video Slider */}
      <section className="relative overflow-hidden pt-20">
        {videos.map((src, index) => (
          <video
            key={index}
            ref={(el) => (videoRefs.current[index] = el)}
            autoPlay={index === 0}
            muted
            playsInline
            onEnded={handleVideoEnd}
            className={`w-full h-[60vh] md:h-[75vh] object-cover absolute top-20 left-0 transition-opacity duration-1000 ${
              index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-20" />
        <div className="relative h-[60vh] md:h-[75vh]"></div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-12 bg-green-600" />
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">About Company</h2>
              </div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Godawari Fish & Company is a trusted name in Chhatrapati Sambhajinagar (Aurangabad) 
                for fresh and premium quality fish and seafood. With over 39 years of experience, 
                we have been serving the community with the freshest catch of the day.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                We offer a wide variety of sea fish, fresh water fish, and seafood. Our products 
                are sourced directly from trusted fishermen and suppliers, ensuring the highest 
                quality and freshness for our customers.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Sparkles className="text-green-700" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Our Mission</h4>
                    <p className="text-gray-600">
                      To deliver fresh, high-quality fish and seafood to our customers with excellent service.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Star className="text-green-700" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Our Vision</h4>
                    <p className="text-gray-600">
                      To be the leading and most trusted fish supplier in the region.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <img
                src="https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&h=700&fit=crop"
                alt="About Us"
                className="rounded-2xl shadow-2xl w-full h-auto glow-card"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Products Categories */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Our Complete Product Range
            </h2>
            <p className="text-gray-600 text-lg">
              Explore all our fresh and frozen fish products with guaranteed quality!
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <ProductCategory
                key={category.title}
                title={category.title}
                image={category.image}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Trusted by <span className="gradient-text">Thousands</span> of Families
            </h2>
            <p className="text-gray-600 text-lg">
              Numbers that speak for our commitment to freshness
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedStat value="39+" label="Years of Trust" delay={0} />
            <AnimatedStat value="1000+" label="Happy Customers" delay={150} />
            <AnimatedStat value="40+" label="Fresh Fishes" delay={300} />
            <AnimatedStat value="15+" label="Frozen Seafood" delay={450} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Daily Rates */}
      <DailyRates />

      {/* Reviews */}
      <ReviewsSection />

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-green-800 text-white animate-gradient">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Ready to Order Fresh Fish?
            </h2>
            <p className="text-xl mb-8 text-green-50/90">
              Contact Godawari Fish & Company on WhatsApp or call to place your order
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://wa.me/919371306189"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow ripple shake pop-hover bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-full font-semibold transition transform hover:scale-105 shadow-xl"
              >
                💬 Chat on WhatsApp
              </a>
              <a
                href="tel:9371306189"
                className="btn-glow ripple shake pop-hover bg-white hover:bg-gray-100 text-green-600 px-8 py-3.5 rounded-full font-semibold transition transform hover:scale-105 shadow-xl"
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
