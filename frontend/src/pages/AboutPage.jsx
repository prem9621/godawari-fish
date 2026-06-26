import React, { useEffect, useState } from 'react';
import { CheckCircle, MapPin, Sparkles, User, Clock, TrendingUp, Building2, Users, Home, Utensils } from 'lucide-react';
import { api, resolveImageUrl } from '../utils/api';
import ScrollReveal from '../components/ScrollReveal';

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
    settings?.owner_role || 'Director · Sameer Qureshi';
  const ownerBio = settings?.owner_bio || '';
  const ownerImage = resolveImageUrl(settings?.owner_image_url);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">
            Godawari Fish: A Legacy of Trust, Quality, and Generations
          </h1>
          <p className="text-blue-100 text-base sm:text-lg">
            Delivering Freshness from Godavari to Your Kitchen Since 1985
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Our Story */}
          <ScrollReveal className="mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Sparkles size={16} />
              Our Story: A Teacher’s Vision, An Unwavering Trust
            </div>
            <div className="space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
              <p>
                Our journey began in 1985-86, when our founder, Mr. Ahmed Sahab, a visionary teacher, recognized the unmatched quality of fish from the Jayakwadi Dam (Nathsagar). He pioneered the bold initiative of supplying premium fish from Aurangabad to the markets of Kolkata. He always believed that "Success demands time" (सफलता वक्त मांगती है)—and it was this patience and foresight that laid our foundation.
              </p>
              <p>
                When circumstances in Kolkata took a turn in 1987-88, bringing our supply chain to a halt, Mr. Ahmed Sahab did not lose hope. Turning this challenge into an opportunity, he embraced the spirit of resilience. From 1988 to 1990, he worked tirelessly, selling fish on footpaths, in baskets, and across open streets. This period was a true test of his passion and determination. This struggle paved the way for our growth, culminating in the opening of our first permanent shop at Baroodgar Nala in 1992.
              </p>
              <p>
                From that era to this day, we have maintained a strong presence in the city’s weekly markets. Naseer Bhai played a pivotal role by operating in these markets, selling fresh produce, and personally connecting with customers to introduce them to our permanent retail outlet, effectively making them a part of our extended family.
              </p>
              <p>
                Today, the reins of our business are in the capable hands of our second-generation head, Moin Qureshi Sahab, under whose expert guidance and leadership our entire business operations are centralized.
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <ScrollReveal className="mb-12 sm:mb-16" delay={150}>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center">
              The Timeline of Our <span className="text-blue-600">Growth</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { year: '1996-97', event: 'Expanded our reach to the growing areas of Cidco and MIDC with our Central Naka branch.' },
                { year: '2001-02', event: 'Bashir Ahmed Sahab pioneered large-scale Hotel Supplies to meet the needs of the hospitality sector.' },
                { year: '2004', event: 'Wazir Qureshi introduced a premium range of seafood, catering to the South Indian and Bengali communities in MIDC.' },
                { year: '2012', event: 'Sameer Qureshi revolutionized the market by introducing frozen and imported seafood (Norwegian Salmon, Japanese Tuna, Vietnamese Basa, and Export-Quality Prawns).' },
                { year: '2016', event: 'Zaheer Qureshi inaugurated a new branch in the Satara area (Beed Bypass Road) to better serve our customers.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 sm:p-6 rounded-xl border border-blue-200">
                  <h3 className="font-bold text-lg sm:text-xl text-blue-700 mb-2">{item.year}</h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{item.event}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Quick Highlights */}
          <ScrollReveal className="mb-12 sm:mb-16" delay={300}>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 sm:p-8 md:p-10 rounded-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center">
                Quick <span className="text-blue-600">Highlights</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md text-center">
                  <Clock className="mx-auto text-blue-600 mb-3" size={32} />
                  <h4 className="font-bold text-base sm:text-lg mb-1">Established</h4>
                  <p className="text-gray-700 text-sm sm:text-base">1985</p>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md text-center">
                  <Users className="mx-auto text-blue-600 mb-3" size={32} />
                  <h4 className="font-bold text-base sm:text-lg mb-1">Generations</h4>
                  <p className="text-gray-700 text-sm sm:text-base">3rd Generation Strong</p>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md text-center">
                  <TrendingUp className="mx-auto text-blue-600 mb-3" size={32} />
                  <h4 className="font-bold text-base sm:text-lg mb-1">Mission</h4>
                  <p className="text-gray-700 text-sm sm:text-base">Delivering Freshness from Godavari to Your Kitchen</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Our Services */}
          <ScrollReveal className="mb-12 sm:mb-16" delay={450}>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center">
              Our <span className="text-blue-600">Services</span>
            </h2>
            <p className="text-center text-gray-700 text-sm sm:text-base mb-6 sm:mb-8 max-w-3xl mx-auto">
              We don't just sell fish; we cater to the vital needs of Aurangabad.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: Home, title: 'Retail Outlets', description: 'Freshness you can trust.' },
                { icon: Utensils, title: 'Hotel, Catering & Canteen Supply', description: 'Trusted partners for major hotels and corporate kitchens.' },
                { icon: TrendingUp, title: 'Home Delivery', description: 'Bringing premium seafood to your doorstep.' },
                { icon: Building2, title: 'Institutional Supply', description: 'Proud suppliers to the Siddharth Garden wildlife.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100 text-center">
                  <item.icon className="mx-auto text-blue-600 mb-3" size={32} />
                  <h4 className="font-bold text-base sm:text-lg mb-2">{item.title}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Stepping into the Future */}
          <ScrollReveal className="mb-12 sm:mb-16" delay={600}>
            <div className="bg-gradient-to-r from-blue-700 to-cyan-800 p-6 sm:p-8 md:p-10 rounded-2xl text-white">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center">
                Stepping into the <span className="text-cyan-200">Future</span>
              </h2>
              <p className="text-center text-blue-50 text-sm sm:text-base leading-relaxed">
                As of 2026-27, our third generation—Tausif Qureshi, Shahbaz Khan, Adil Qureshi, and Uzair Nasir Qureshi—is taking this legacy to new heights. By 2028, our goal is to strengthen our network by expanding with 5 to 6 new branches not just within the city, but also in other cities beyond Aurangabad.
              </p>
            </div>
          </ScrollReveal>

          {/* Owner Profile Card + Note from Founder's Desk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mb-12 sm:mb-16">
            <ScrollReveal>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-300/40 to-blue-500/40 rounded-3xl blur-2xl pointer-events-none"></div>
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
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 sm:p-8 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-lg sm:text-xl text-blue-800 mb-4">
                  A Note from the Founder’s Desk
                </h4>
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed italic space-y-4">
                  <p>
                    "My journey with Godawari Fish has been more than just a business; it has been a commitment to quality and a promise of freshness that our family has upheld since 1985. Every piece of seafood that reaches your table carries the legacy of my grandfather, the hard work of our elders, and the passion of our current team."
                  </p>
                  <p>
                    "As we continue to grow beyond Aurangabad, our goal remains simple: to serve you with the same integrity and excellence that started on a small street corner decades ago. Thank you for making us a part of your homes and celebrations."
                  </p>
                  <p className="font-semibold text-right mt-4 not-italic text-blue-800">
                    — Sameer Qureshi<br />
                    <span className="text-sm">Director, Godawari Fish</span>
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {[
              { title: 'Founded', desc: '1985 · 3rd Generation Strong' },
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