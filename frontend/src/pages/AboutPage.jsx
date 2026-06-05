import React, { useEffect, useState } from 'react';
import { CheckCircle, MapPin, Sparkles, User } from 'lucide-react';
import { api, resolveImageUrl } from '../utils/api';
import ScrollReveal from '../components/ScrollReveal';

const FALLBACK_STORY =
  'Godavari Fish, owned by Sameer Qureshi & Brothers, has been serving the community with premium quality seafood for over 15 years. Located in the heart of Central Naka, near MGM Hospital, we have built a reputation as the most trusted local seafood supplier. Our commitment to quality starts from the source — we partner with trusted suppliers to ensure that only the freshest catch reaches your table. Every product undergoes strict quality checks before reaching our customers.';

const AboutPage = () => {
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .getSettings()
      .then((data) => {
        if (alive) setSettings(data || {});
      })
      .catch((err) => {
        console.error('Error loading settings:', err);
        if (alive) setSettings({});
      })
      .finally(() => {
        if (alive) setLoadingSettings(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const ownerName = settings?.owner_name || 'Sameer Qureshi';
  const ownerRole =
    settings?.owner_role || 'Owner · Sameer Qureshi & Brothers';
  const ownerBio = settings?.owner_bio || '';
  const ownerImage = resolveImageUrl(settings?.owner_image_url);
  const businessStory = settings?.business_story || FALLBACK_STORY;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">
            About Godavari Fish
          </h1>
          <p className="text-blue-100 text-base sm:text-lg">
            Bringing Fresh Seafood Excellence to Your Table
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Owner + Story — owner stacks above on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mb-16">
            {/* Business Story */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                <Sparkles size={16} />
                Our Story
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6">
                Three Generations of{' '}
                <span className="gradient-text">Trust</span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {businessStory}
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base mt-4">
                Whether you're looking for fresh fish for your family dinner or
                bulk supplies for your restaurant, we have everything you need.
              </p>
            </ScrollReveal>

            {/* Owner Profile Card */}
            <ScrollReveal delay={150}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-300/40 to-blue-500/40 rounded-3xl blur-2xl animate-pulse-glow pointer-events-none"></div>
                <div className="relative bg-gradient-to-br from-blue-500/95 to-cyan-600/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/20 shadow-2xl text-white">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="relative flex-shrink-0">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl bg-white/15 flex items-center justify-center">
                        {loadingSettings ? (
                          <div className="w-full h-full bg-white/20 animate-pulse"></div>
                        ) : ownerImage ? (
                          <img
                            src={ownerImage}
                            alt={ownerName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fall back to placeholder if the image 404s
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement
                                .querySelector('svg.placeholder')
                                ?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <User
                          className={`placeholder w-16 h-16 sm:w-20 sm:h-20 text-white/80 ${
                            ownerImage && !loadingSettings ? 'hidden' : ''
                          }`}
                        />
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-extrabold mb-1">
                        {ownerName}
                      </h3>
                      <p className="text-cyan-100 text-sm font-semibold mb-3">
                        {ownerRole}
                      </p>
                      {ownerBio && (
                        <p className="text-blue-50/90 text-sm leading-relaxed">
                          {ownerBio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl border border-white/20 text-center">
                      <p className="text-xs uppercase tracking-wider text-cyan-100">
                        Founded
                      </p>
                      <p className="font-bold text-sm sm:text-base">
                        15+ Years
                      </p>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl border border-white/20 text-center">
                      <p className="text-xs uppercase tracking-wider text-cyan-100">
                        Customers
                      </p>
                      <p className="font-bold text-sm sm:text-base">500+</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl border border-white/20 text-center">
                      <p className="text-xs uppercase tracking-wider text-cyan-100">
                        Support
                      </p>
                      <p className="font-bold text-sm sm:text-base">24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Quality Highlights */}
          <ScrollReveal className="mb-12 sm:mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 sm:p-8 md:p-12 rounded-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 sm:mb-12 text-center">
                Our Commitment to <span className="gradient-text">Quality</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {[
                  {
                    title: 'Fresh Daily Stock',
                    description:
                      'We receive fresh catch daily from trusted suppliers, ensuring the best quality products',
                  },
                  {
                    title: 'Hygienic Processing',
                    description:
                      'All fish and seafood are processed in clean, hygienic conditions with expert care',
                  },
                  {
                    title: 'Quality Assurance',
                    description:
                      'Every product undergoes strict quality checks before it reaches your table',
                  },
                  {
                    title: 'Trusted Supplier',
                    description:
                      'We have earned the trust of hundreds of families and businesses in the community',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="glow-card bg-white p-5 sm:p-6 rounded-xl shadow-md"
                  >
                    <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-blue-600">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Facts (kept from the original page) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {[
              { title: 'Founded', desc: 'Over 15 years in the seafood business' },
              { title: 'Location', desc: 'Central Naka, Near MGM Hospital, Chhatrapati Sambhaji Nagar' },
              { title: 'Contact', desc: '📞 9371306189  ·  📧 godawarifish189@gmail.com' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100 flex items-start gap-3 sm:gap-4"
              >
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-base sm:text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-700 text-sm whitespace-pre-line">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8">
              Visit Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-video md:aspect-square w-full">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.0246788748596!2d75.33404!3d19.88169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdad78c8f8f8f8f%3A0x8f8f8f8f8f8f8f8f!2sCentral%20Naka%2C%20Chhatrapati%20Sambhaji%20Nagar!5e0!3m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                  <MapPin className="text-blue-600" />
                  Central Naka, Near MGM Hospital
                </h3>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  Chhatrapati Sambhaji Nagar, Maharashtra
                </p>

                <div className="bg-blue-50 p-5 sm:p-6 rounded-xl mb-6">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                    Business Hours
                  </h4>
                  <div className="space-y-2 text-gray-700 text-sm sm:text-base">
                    <p><strong>Weekdays:</strong> 6:00 AM - 9:00 PM</p>
                    <p><strong>Saturday:</strong> 6:00 AM - 10:00 PM</p>
                    <p><strong>Sunday:</strong> 7:00 AM - 9:00 PM</p>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/Godavari+Fish"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition transform hover:scale-105 shadow-md"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
