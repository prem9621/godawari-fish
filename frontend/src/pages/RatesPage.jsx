import React from 'react';
import DailyRates from '../components/DailyRates';

const RatesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">
            Today's Fresh Stock & Daily Rates
          </h1>
          <p className="text-blue-100 text-base sm:text-lg">
            Updated daily with fresh catch and current market rates
          </p>
        </div>
      </section>

      {/* Rates Component */}
      <DailyRates />

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center">Available Products</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Popular Fish Varieties</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Pomfret</strong> - Premium quality, perfect for frying</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Surmai</strong> - Great for curries and steaks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Rohu</strong> - Excellent for rich curries</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Katla</strong> - Tender and flavorful</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Badshah Fish</strong> - Premium choice</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Seafood Specialties</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Prawns</strong> - Fresh and succulent</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Crabs</strong> - Live and fresh</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Squid</strong> - Tender quality</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Frozen Seafood</strong> - Available on request</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Fish Fillets</strong> - Boneless options</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Availability Info */}
          <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
            <h3 className="font-bold text-yellow-900 mb-2">Rate Updates</h3>
            <p className="text-yellow-800">
              Our daily rates are updated every morning based on market prices and availability. 
              Rates may vary based on demand and season. For best rates and availability, 
              contact us directly on WhatsApp or call our shop.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RatesPage;
