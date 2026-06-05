import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const FloatingButtons = () => {
  const phoneNumber = '919371306189';
  const businessName = 'Godavari Fish';

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
      <a
        href={`https://wa.me/${phoneNumber}?text=Hi%20${businessName}%2C%20I%20would%20like%20to%20know%20more%20about%20your%20fish%20products`}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-300 animate-pulse-glow"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={26} className="group-hover:animate-wiggle" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Chat on WhatsApp
        </span>
      </a>
      <a
        href={`tel:${phoneNumber}`}
        className="group bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transform hover:scale-110 hover:-rotate-6 transition-all duration-300 animate-pulse-glow"
        title="Call Now"
        style={{ animationDelay: '1.25s' }}
      >
        <Phone size={26} className="group-hover:animate-wiggle" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Call Now
        </span>
      </a>
    </div>
  );
};

export default FloatingButtons;
