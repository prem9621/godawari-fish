import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: '🛒 Shop' },
  { href: '/about', label: 'About' },
  { href: '/rates', label: 'Daily Rates' },
  { href: '/wholesale', label: 'Wholesale' },
  { href: '/contact', label: 'Contact' },
];

const Header = ({ isAdminPage = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 text-white transition-all duration-500 animate-gradient ${
        scrolled
          ? 'bg-gradient-to-r from-green-700/95 to-green-900/95 backdrop-blur-md shadow-2xl'
          : 'bg-gradient-to-r from-green-600 to-green-800 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            {/* Logo Container */}
            <div className="bg-white rounded-xl p-2 shadow-lg group-hover:rotate-3 transition-transform duration-500">
              <img
                src="/godawari_logo.png"
                alt="Godawari Fish & Company Logo"
                className="h-12 w-auto"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold tracking-tight">
                Godawari <span className="text-cyan-200">Fish</span>
              </span>
              <span className="text-xs text-cyan-300 font-semibold tracking-widest uppercase">
                & Company
              </span>
            </div>
          </a>

          {!isAdminPage && (
            <>
              <nav className="hidden md:flex space-x-6 items-center">
                {NAV_ITEMS.map((item) => (
                  <a key={item.href} href={item.href} className="nav-link hover:text-cyan-200 text-sm font-medium">
                    {item.label}
                  </a>
                ))}
                <a
                  href="/admin"
                  className="btn-glow bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-full hover:from-orange-600 hover:to-amber-600 transition transform hover:scale-105 shadow-md text-sm font-semibold"
                >
                  Admin
                </a>
              </nav>
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </>
          )}
        </div>

        {!isAdminPage && (
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ${
              mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
            }`}
          >
            <nav className="space-y-2 pt-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block py-2 px-3 rounded-lg hover:bg-white/10 hover:text-cyan-200 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/admin"
                className="block bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-full text-center hover:from-orange-600 hover:to-amber-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
