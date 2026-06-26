import React, { useState } from 'react';
import { api } from '../utils/api';
import { MessageCircle } from 'lucide-react';

const WholesalePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    mobile: '',
    product_requirement: '',
    quantity: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.createInquiry(formData);
      setSubmitMessage('Thank you! Your inquiry has been received. We will contact you shortly.');
      setFormData({
        name: '',
        business_name: '',
        mobile: '',
        product_requirement: '',
        quantity: '',
        message: '',
      });
      setTimeout(() => setSubmitMessage(''), 5000);
    } catch (error) {
      setSubmitMessage('Error submitting inquiry. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Wholesale & Bulk Supply</h1>
          <p className="text-green-100 text-lg">Premium quality seafood for hotels, restaurants, and businesses</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Left Side - Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Why Choose Godavari Fish for Wholesale?</h2>

              <div className="space-y-6">
                {[
                  {
                    title: 'Competitive Wholesale Rates',
                    description: 'Best prices for bulk orders with special discounts for regular customers',
                  },
                  {
                    title: 'Fresh Quality Guaranteed',
                    description: 'All products are fresh, hygienic, and meet highest quality standards',
                  },
                  {
                    title: 'Flexible Delivery',
                    description: 'Delivery available to your location based on order volume',
                  },
                  {
                    title: 'Custom Cutting Services',
                    description: 'We provide custom cutting and preparation as per your requirements',
                  },
                  {
                    title: 'Reliable Supply',
                    description: 'Consistent supply of products with reliability you can count on',
                  },
                  {
                    title: '24/7 WhatsApp Support',
                    description: 'Get in touch anytime for orders, queries, or special requirements',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <h3 className="font-bold text-lg mb-2 text-green-600">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Send Inquiry</h2>

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
                    <label className="block font-semibold mb-2 text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-base min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Business Name</label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="Your business name"
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
                      className="w-full px-4 py-3 text-base min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Product Requirement</label>
                    <input
                      type="text"
                      name="product_requirement"
                      value={formData.product_requirement}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="e.g., Pomfret, Surmai, Prawns"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Quantity</label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="e.g., 10 kg, 50 pieces"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-700 mb-3">Or contact us directly:</p>
                  <a
                    href="https://wa.me/919371306189?text=Hi%20Godavari%20Fish%2C%20I%20need%20wholesale%20supplies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
                  >
                    <MessageCircle size={20} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Target Customers */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-12 rounded-lg mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">We Serve</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { icon: '🏨', label: 'Hotels' },
                { icon: '🍽️', label: 'Restaurants' },
                { icon: '🎉', label: 'Caterers' },
                { icon: '🎊', label: 'Event Organizers' },
                { icon: '🛒', label: 'Bulk Buyers' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                  <p className="text-4xl mb-3">{item.icon}</p>
                  <p className="font-semibold text-gray-800">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WholesalePage;
