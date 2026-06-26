import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Star, ExternalLink } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const GOOGLE_MAPS_LINK = 'https://share.google/2MtIQfCr7kSC1STPs';

// Real Google Maps embed — using coordinates from the share link
// Godawari Fish, Central Naka, Chhatrapati Sambhaji Nagar
const MAP_EMBED = `https://maps.google.com/maps?q=19.8817,75.3340&z=17&output=embed`;

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${base}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitMessage('Thank you! We will get back to you soon.');
        setFormData({ name: '', email: '', mobile: '', message: '' });
        setTimeout(() => setSubmitMessage(''), 5000);
      } else {
        setSubmitMessage('Error submitting form. Please try again.');
      }
    } catch {
      setSubmitMessage('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-14 animate-gradient relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <img src="/godawari_logo.png" alt="Godawari Fish & Company" className="h-20 w-auto mx-auto mb-4 drop-shadow-xl animate-float" />
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-green-100 text-lg">Godawari Fish & Company – Get in touch for orders or inquiries</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              <div className="space-y-4 mb-8">

                <ScrollReveal>
                  <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition hover:-translate-y-1">
                    <Phone className="text-green-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <a href="tel:9371306189" className="text-green-600 hover:underline text-lg font-semibold">9371306189</a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={80}>
                  <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition hover:-translate-y-1">
                    <MessageCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold mb-1">WhatsApp</h3>
                      <a href="https://wa.me/919371306189" target="_blank" rel="noopener noreferrer"
                        className="text-green-600 hover:underline text-lg font-semibold">Chat on WhatsApp</a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={160}>
                  <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition hover:-translate-y-1">
                    <Mail className="text-red-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <a href="mailto:godawarifish189@gmail.com" className="text-red-600 hover:underline">
                        godawarifish189@gmail.com
                      </a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={240}>
                  <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition hover:-translate-y-1">
                    <MapPin className="text-orange-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold mb-1">Address</h3>
                      <p className="text-gray-700">Central Naka, Near MGM Hospital</p>
                      <p className="text-gray-700">Chhatrapati Sambhaji Nagar, Maharashtra</p>
                      <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-green-600 hover:underline text-sm font-semibold">
                        <ExternalLink size={13} /> View on Google Maps
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Business Hours */}
              <ScrollReveal delay={300}>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
                    <Clock size={20} /> Business Hours
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="font-semibold text-gray-700">Weekdays (Mon–Fri)</span>
                      </div>
                      <span className="text-green-700 font-bold">9:00 AM – 9:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                        <span className="font-semibold text-gray-700">Weekends (Sat–Sun)</span>
                      </div>
                      <span className="text-amber-700 font-bold">8:00 AM – 10:00 PM</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <ScrollReveal delay={100}>
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                {submitMessage && (
                  <div className={`mb-6 p-4 rounded-lg ${submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {submitMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Your Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Mobile Number *</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      placeholder="10-digit mobile number" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      placeholder="Your message..." />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 transform hover:scale-105 shadow-md">
                    {loading ? 'Sending...' : '📨 Send Message'}
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* Google Map + Reviews side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

            {/* Map */}
            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-green-600 text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="font-bold text-sm">Godawari Fish & Company – Find Us</span>
                </div>
                <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-green-200 hover:text-white flex items-center gap-1">
                  Open Maps <ExternalLink size={12} />
                </a>
              </div>
              <iframe
                title="Godawari Fish & Company Location"
                src={MAP_EMBED}
                width="100%"
                height="340"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="px-5 py-3 bg-gray-50 flex items-center justify-between border-t">
                <span className="text-xs text-gray-600">Central Naka, Near MGM Hospital, Chhatrapati Sambhaji Nagar</span>
                <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer"
                  className="text-green-600 text-xs font-semibold hover:underline">
                  Get Directions →
                </a>
              </div>
            </div>

            {/* Google Reviews CTA */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 px-6 py-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={22} fill="white" />
                  <span className="font-bold text-xl">Google Reviews</span>
                </div>
                <p className="text-sm text-white/90">What our customers say</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
                {/* Star rating display */}
                <div>
                  <div className="flex gap-1 justify-center mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={26} className="text-yellow-400" fill="#facc15" />
                    ))}
                  </div>
                  <p className="text-2xl font-extrabold text-gray-800">5.0</p>
                  <p className="text-xs text-gray-400">Based on Google Reviews</p>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed">
                  Our customers love our fresh fish! Click below to read real reviews and see our Google listing.
                </p>

                <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer"
                  className="w-full btn-glow bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-full font-bold transition transform hover:scale-105 shadow-md text-center flex items-center justify-center gap-2">
                  <Star size={16} fill="white" />
                  Read All Reviews
                </a>

                <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer"
                  className="text-green-600 hover:underline text-sm font-semibold flex items-center gap-1">
                  ✏️ Write a Review
                </a>

                <div className="w-full border-t pt-4 mt-2">
                  <p className="text-xs text-gray-400 mb-2">Share your experience:</p>
                  <a href={`https://wa.me/919371306189?text=Hi, I want to share my feedback about Godawari Fish & Company!`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-green-600 text-sm font-semibold hover:underline flex items-center justify-center gap-1">
                    💬 WhatsApp Feedback
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
