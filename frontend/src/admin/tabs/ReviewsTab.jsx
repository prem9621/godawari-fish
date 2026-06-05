import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Eye, EyeOff, Loader2, Star, MessageSquare } from 'lucide-react';

const Stars = ({ rating }) => (
  <span className="text-yellow-400 text-sm">
    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
  </span>
);

const ReviewsTab = ({ token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toggling, setToggling] = useState(null);
  const [filter, setFilter] = useState('all'); // all | visible | hidden

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAdminReviews(token);
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (review) => {
    setToggling(review.id);
    const newVisible = review.is_visible ? 0 : 1;
    try {
      await api.updateReviewVisibility(review.id, newVisible, token);
      setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, is_visible: newVisible } : r));
    } catch {
      setError('Failed to update review visibility.');
    } finally {
      setToggling(null);
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === 'visible') return r.is_visible;
    if (filter === 'hidden') return !r.is_visible;
    return true;
  });

  const visibleCount = reviews.filter((r) => r.is_visible).length;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Reviews</h2>
          <p className="text-sm text-gray-400 mt-0.5">{visibleCount} visible · {reviews.length - visibleCount} hidden</p>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg text-sm">
          {['all', 'visible', 'hidden'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md font-semibold transition capitalize ${
                filter === f ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading reviews...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
          <p>No reviews in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={`border rounded-xl p-4 transition ${
                r.is_visible ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-800">{r.customer_name}</p>
                    <Stars rating={r.rating} />
                    <span className="text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  <p className="text-gray-600 text-sm italic">"{r.review_text}"</p>
                </div>
                <button
                  onClick={() => handleToggle(r)}
                  disabled={toggling === r.id}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    r.is_visible
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                  }`}
                  title={r.is_visible ? 'Click to hide' : 'Click to show'}
                >
                  {toggling === r.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : r.is_visible ? (
                    <Eye size={14} />
                  ) : (
                    <EyeOff size={14} />
                  )}
                  <span className="hidden sm:inline">{r.is_visible ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
