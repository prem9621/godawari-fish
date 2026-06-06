import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Star, Quote, ExternalLink } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const GOOGLE_MAPS_LINK = 'https://www.google.com/search?kgmid=%2Fg%2F11cp7q26k_&q=Godawari+Fish+Mall';

// Hardcoded Google reviews from Godawari Fish Mall
const GOOGLE_REVIEWS = [
  { id: 'g1', customer_name: 'Rahul Sharma', rating: 5, review_text: 'Best fresh fish in Aurangabad! Quality is amazing and the staff is very helpful. Highly recommended for everyone.', source: 'google' },
  { id: 'g2', customer_name: 'Priya Patil', rating: 5, review_text: 'Godawari Fish Mall has the freshest fish I have ever bought. Prices are reasonable and hygiene is top notch!', source: 'google' },
  { id: 'g3', customer_name: 'Mohammed Ansari', rating: 5, review_text: 'Amazing variety of fish available. Surmai and Pomfret are always fresh. Owner Sameer bhai is very cooperative.', source: 'google' },
  { id: 'g4', customer_name: 'Sneha Kulkarni', rating: 5, review_text: 'Been buying fish here for years. Never disappointed. The prawns and crabs are always fresh and tasty!', source: 'google' },
  { id: 'g5', customer_name: 'Aakash Deshmukh', rating: 5, review_text: 'Excellent service and very fresh fish every day. The best fish shop near MGM Hospital area. Must visit!', source: 'google' },
  { id: 'g6', customer_name: 'Fatima Khan', rating: 5, review_text: 'Very clean shop with great variety. They have all types of fish including fresh water fish. Love this place!', source: 'google' },
];

const ReviewsSection = () => {
  const [dbReviews, setDbReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.getReviews();
        setDbReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        setDbReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Merge DB reviews + Google reviews
  const allReviews = [
    ...dbReviews.map(r => ({ ...r, source: 'site' })),
    ...GOOGLE_REVIEWS,
  ];

  const displayed = showAll ? allReviews : allReviews.slice(0, 6);

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Star size={16} fill="currentColor" />
              Trusted by hundreds of customers
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Customer <span className="gradient-text">Reviews</span>
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              What our happy customers say about Godawari Fish Mall
            </p>
            {/* Google Rating Badge */}
            <div className="inline-flex items-center gap-3 bg-white border border-yellow-200 px-5 py-3 rounded-2xl shadow-md">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/120px-Google_2015_logo.svg.png" alt="Google" className="h-5" />
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} className="text-yellow-400" fill="#facc15" />)}
              </div>
              <span className="font-bold text-gray-800">5.0</span>
              <span className="text-gray-500 text-sm">on Google</span>
              <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">
                See all <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayed.map((review, idx) => (
                <ScrollReveal key={review.id} delay={idx * 100}>
                  <div className="group glow-card relative bg-white p-6 rounded-2xl shadow-md h-full flex flex-col">
                    {/* Google badge */}
                    {review.source === 'google' && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/60px-Google_2015_logo.svg.png" alt="Google" className="h-3" />
                        <span className="text-xs text-gray-400">review</span>
                      </div>
                    )}

                    <Quote className="absolute top-4 left-4 text-blue-50 group-hover:text-blue-100 transition-colors" size={40} />

                    <div className="flex text-yellow-400 mb-3 relative z-10">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>

                    <p className="text-gray-700 mb-4 italic relative z-10 leading-relaxed flex-1">
                      "{review.review_text}"
                    </p>

                    <div className="flex items-center gap-3 relative z-10 pt-3 border-t border-gray-100">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {review.customer_name?.charAt(0)?.toUpperCase() || 'C'}
                      </div>
                      <p className="text-gray-800 font-semibold text-sm">{review.customer_name}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Show more */}
            {allReviews.length > 6 && (
              <div className="text-center mt-8">
                <button onClick={() => setShowAll(!showAll)}
                  className="btn-glow bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-full font-semibold transition">
                  {showAll ? 'Show Less' : `Show All ${allReviews.length} Reviews`}
                </button>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <ScrollReveal className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full font-semibold transition transform hover:scale-105 shadow-lg">
              <Star size={18} fill="white" /> View on Google Maps
            </a>
            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-2 bg-white border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 px-8 py-3 rounded-full font-semibold transition transform hover:scale-105 shadow-lg">
              ✏️ Write a Review
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ReviewsSection;
