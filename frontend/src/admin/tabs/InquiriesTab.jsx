import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { MessageCircle, Loader2, Inbox } from 'lucide-react';

const STATUSES = ['pending', 'contacted', 'closed'];

const statusStyle = (s) => {
  if (s === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (s === 'contacted') return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const InquiriesTab = ({ token }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getInquiries(token);
      setInquiries(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await api.updateInquiry(id, status, token);
      setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    } catch {
      setError('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Wholesale Inquiries</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{inquiries.length} total</span>
      </div>

      {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading inquiries...
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Inbox size={40} className="mx-auto mb-2 opacity-30" />
          <p>No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Name</p>
                    <p className="font-semibold text-gray-800">{inq.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Mobile</p>
                    <p className="font-semibold text-gray-800">{inq.mobile}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Business</p>
                    <p className="font-semibold text-gray-800">{inq.business_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Requirement</p>
                    <p className="font-semibold text-gray-800 truncate">{inq.product_requirement || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {inq.message && (
                <p className="text-gray-600 text-sm bg-gray-50 rounded-lg px-3 py-2 mb-3">{inq.message}</p>
              )}

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Status selector */}
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      disabled={updating === inq.id}
                      onClick={() => handleStatusChange(inq.id, s)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition capitalize ${
                        inq.status === s
                          ? statusStyle(s) + ' ring-2 ring-offset-1 ' + (s === 'pending' ? 'ring-yellow-400' : s === 'contacted' ? 'ring-blue-400' : 'ring-gray-400')
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {updating === inq.id && inq.status !== s ? s : s}
                    </button>
                  ))}
                </div>

                <div className="sm:ml-auto flex items-center gap-3 text-xs text-gray-400">
                  <span>{new Date(inq.created_at).toLocaleDateString('en-IN')}</span>
                  <a
                    href={`https://wa.me/91${inq.mobile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesTab;
