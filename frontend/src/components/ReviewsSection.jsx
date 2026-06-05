import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Star, Quote } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.getReviews();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">
            Customer <span className="gradient-text">Reviews</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            What our happy customers say about us
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="text-center text-gray-600 py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-600 py-12">No reviews yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <ScrollReveal key={review.id} delay={idx * 120}>
                <div className="group glow-card relative bg-white p-6 rounded-2xl shadow-md h-full">
                  <Quote
                    className="absolute top-4 right-4 text-blue-100 group-hover:text-blue-200 transition-colors"
                    size={48}
                  />
                  <div className="flex items-center mb-3 relative z-10">
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          fill="currentColor"
                          className="animate-float"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic relative z-10 leading-relaxed">
                    "{review.review_text}"
                  </p>
                  <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {review.customer_name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <p className="text-gray-800 font-semibold">- {review.customer_name}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal className="text-center mt-12">
          <a
            href="https://www.google.com/maps/search/Godavari+Fish"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full font-semibold transition transform hover:scale-105 shadow-lg"
          >
            📍 View on Google Maps
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ReviewsSection;
