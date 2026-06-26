import React from 'react';
import { Utensils, Wind, ShieldCheck } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      name: 'Fresh Daily Stock',
      description: 'Fresh catch delivered daily from trusted suppliers',
      icon: Wind,
      color: 'from-emerald-500 to-green-500',
    },
    {
      id: 2,
      name: 'Hygienic Processing',
      description: 'Expert cutting and cleaning services available',
      icon: Utensils,
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 3,
      name: 'Quality Assurance',
      description: 'Premium quality products with strict quality checks',
      icon: ShieldCheck,
      color: 'from-teal-500 to-emerald-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            What makes us the trusted choice for fresh seafood
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <ScrollReveal key={service.id} delay={idx * 150}>
                <div className="group glow-card bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-md h-full">
                  <div
                    className={`bg-gradient-to-br ${service.color} text-white rounded-2xl w-16 h-16 flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3 group-hover:text-green-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-center text-gray-700">{service.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="mt-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 p-10 rounded-3xl shadow-2xl animate-gradient">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 right-4 w-40 h-40 bg-yellow-200 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 text-center text-white">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
                Custom Cutting & Cleaning Services
              </h3>
              <p className="text-green-50/90 mb-8 text-lg">
                Hygienic cutting and cleaning available according to your requirements
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['Whole Fish', 'Curry Cut', 'Steak Cut', 'Boneless Fillet', 'Cleaned & Ready'].map(
                  (cut, idx) => (
                    <div
                      key={idx}
                      className="bg-white/15 backdrop-blur-sm hover:bg-white/25 border border-white/20 p-4 rounded-xl text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    >
                      <p className="font-semibold text-white">{cut}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesSection;
