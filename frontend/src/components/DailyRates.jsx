import React, { useState, useEffect } from 'react';
import { api, resolveImageUrl } from '../utils/api';
import { AlertCircle, Fish } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const DailyRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await api.getRates();
        setRates(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching rates:', error);
        setRates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-green-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Fish size={16} className="animate-float" />
              Today's Catch
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Fresh Stock & <span className="gradient-text">Daily Rates</span>
            </h2>
            <p className="text-gray-600">
              Updated daily · Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="text-center text-gray-600 py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4">Loading rates...</p>
          </div>
        ) : rates.length === 0 ? (
          <div className="text-center text-gray-600 py-12">No rates available yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {rates.map((rate, idx) => (
              <ScrollReveal key={rate.id} delay={idx * 100}>
                <div
                  className={`group glow-card bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col ${
                    rate.availability === 'Out of Stock' ? 'opacity-70' : ''
                  }`}
                >
                  {rate.image_url && (
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={resolveImageUrl(rate.image_url)}
                        alt={rate.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                      {rate.name}
                    </h3>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Rate per {rate.unit}</p>
                        <p className="text-3xl font-extrabold gradient-text">₹{rate.rate}</p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          rate.availability === 'Available'
                            ? 'bg-green-100 text-green-700 animate-pulse-glow'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {rate.availability}
                      </div>
                    </div>

                    {rate.weight != null && Number(rate.weight) > 0 && (
                      <div className="mb-4 inline-flex items-center gap-1.5 self-start bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                        ⚖️ {rate.weight} {rate.weight_unit || 'kg'} available
                      </div>
                    )}

                    <a
                      href={`https://wa.me/919371306189?text=Hi%2C%20I%20would%20like%20to%20order%20${rate.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-glow mt-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-full transition text-center font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Order on WhatsApp
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal className="mt-12">
          <div className="relative overflow-hidden bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-600 p-6 rounded-2xl shadow-md">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-green-600 mt-1 flex-shrink-0 animate-float" size={28} />
              <div>
                <h3 className="font-bold text-green-900 mb-2 text-lg">
                  Need Wholesale Supplies?
                </h3>
                <p className="text-green-800 mb-3">
                  Contact us for bulk orders and wholesale rates. Perfect for hotels,
                  restaurants, and catering services.
                </p>
                <a
                  href="/wholesale"
                  className="text-green-600 font-semibold hover:underline inline-flex items-center gap-1 group"
                >
                  Learn more about wholesale
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DailyRates;
