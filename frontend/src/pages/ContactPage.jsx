import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });
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
      const response = await fetch('http://localhost:5000/api/contact', {
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
    } catch (error) {
      setSubmitMessage('Error submitting form. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-blue-100 text-lg">Get in touch with us for orders or inquiries</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <Phone className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold mb-2">Phone</h3>
                    <a href="tel:9371306189" className="text-blue-600 hover:underline text-base sm:text-lg font-semibold">
                      9371306189
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <MessageCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold mb-2">WhatsApp</h3>
                    <a
                      href="https://wa.me/919371306189"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-base sm:text-lg font-semibold"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <Mail className="text-red-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold mb-2">Email</h3>
                    <a href="mailto:godawarifish189@gmail.com" className="text-red-600 hover:underline">
                      godawarifish189@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <MapPin className="text-orange-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold mb-2">Address</h3>
                    <p className="text-gray-700">Central Naka, Near MGM Hospital</p>
                    <p className="text-gray-700">Chhatrapati Sambhaji Nagar, Maharashtra</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Monday - Friday:</strong> 6:00 AM - 9:00 PM</p>
                  <p><strong>Saturday:</strong> 6:00 AM - 10:00 PM</p>
                  <p><strong>Sunday:</strong> 7:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              {submitMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitMessage.includes('Thank you')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-base min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-base min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-base min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="bg-gray-100 rounded-lg overflow-hidden h-96 mb-16">
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
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
