import React from 'react';
import ScrollReveal from './ScrollReveal';

const Footer = () => {
  const businessHours = {
    weekdays: '9:00 AM – 9:00 PM',
    weekends: '8:00 AM – 10:00 PM',
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-gray-300 mt-16 overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 leading-none -translate-y-px">
        <svg
          className="block w-full h-12 text-gray-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/godawari_logo.png"
                alt="Godawari Fish & Company"
                className="h-14 w-auto drop-shadow-lg"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-white font-extrabold text-lg">Godawari Fish</span>
                <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">& Company</span>
              </div>
            </div>
            <p className="text-sm mb-1 italic text-cyan-300">"The Real Taste of Fresh Fish"</p>
            <p className="text-sm mt-2">Central Naka, Near MGM Hospital</p>
            <p className="text-sm">Chhatrapati Sambhaji Nagar, Maharashtra</p>
          </ScrollReveal>

          {/* Contact */}
          <ScrollReveal delay={100}>
            <h3 className="text-white font-bold mb-4 gradient-text inline-block">Contact</h3>
            <p className="text-sm mb-2">
              <strong>Phone:</strong>
              <a href="tel:9371306189" className="hover:text-cyan-400 transition"> 9371306189</a>
            </p>
            <p className="text-sm mb-2">
              <strong>WhatsApp:</strong>
              <a href="https://wa.me/919371306189" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition"> Chat Now</a>
            </p>
            <p className="text-sm">
              <strong>Email:</strong>
              <a href="mailto:godawarifish189@gmail.com" className="hover:text-cyan-400 transition"> godawarifish189@gmail.com</a>
            </p>
          </ScrollReveal>

          {/* Business Hours */}
          <ScrollReveal delay={200}>
            <h3 className="text-white font-bold mb-4 gradient-text inline-block">Business Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <div>
                  <p className="font-semibold text-white">Weekdays (Mon–Fri)</p>
                  <p>{businessHours.weekdays}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                <div>
                  <p className="font-semibold text-white">Weekends (Sat–Sun)</p>
                  <p>{businessHours.weekends}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Links */}
          <ScrollReveal delay={300}>
            <h3 className="text-white font-bold mb-4 gradient-text inline-block">Quick Links</h3>
            <ul className="text-sm space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: '🛒 Shop' },
                { href: '/about', label: 'About Us' },
                { href: '/rates', label: 'Daily Rates' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-transform"
                  >
                    → {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>

        <div className="border-t border-gray-700/50 mt-10 pt-6 text-center text-sm">
          <p className="text-gray-400">
            © 2025{' '}
            <span className="text-cyan-400 font-semibold">Godawari Fish & Company</span>. All
            rights reserved. | Owner:{' '}
            <span className="text-white">Sameer Qureshi & Brothers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
