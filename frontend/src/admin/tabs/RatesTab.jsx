import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Plus, Edit2, X, Loader2, TrendingUp } from 'lucide-react';

const AVAILABILITY = ['Available', 'Limited', 'Out of Stock'];
const UNITS = ['kg', 'piece', 'dozen'];
const WEIGHT_UNITS = ['kg', 'g', 'quintal'];

const emptyForm = {
  product_id: '',
  rate: '',
  unit: 'kg',
  availability: 'Available',
  weight: '',
  weight_unit: 'kg',
};

const RatesTab = ({ token }) => {
  const [rates, setRates] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editRate, setEditRate] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [rData, pData] = await Promise.all([api.getRates(), api.getProducts()]);
      setRates(Array.isArray(rData) ? rData : []);
      setProducts(Array.isArray(pData) ? pData : []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const openAdd = () => {
    setEditRate(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditRate(r);
    setForm({
      product_id: r.product_id,
      rate: r.rate,
      unit: r.unit || 'kg',
      availability: r.availability || 'Available',
      weight: r.weight ?? '',
      weight_unit: r.weight_unit || 'kg',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditRate(null);
    setForm(emptyForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.rate) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        product_id: form.product_id,
        rate: Number(form.rate),
        unit: form.unit,
        availability: form.availability,
        weight: form.weight !== '' ? Number(form.weight) : null,
        weight_unit: form.weight_unit,
      };

      if (editRate) {
        await api.updateRate(editRate.id, payload, token);
      } else {
        await api.createRate(payload, token);
      }
      
      closeModal();
      await loadAll();
    } catch (err) {
      console.error('Error saving rate:', err);
      setError(err.message || 'Failed to save rate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const availColor = (a) => {
    if (a === 'Available') return 'bg-green-100 text-green-800';
    if (a === 'Limited') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Daily Rates</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm font-semibold"
        >
          <Plus size={18} /> Set Rate
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading rates...
        </div>
      ) : rates.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <TrendingUp size={40} className="mx-auto mb-2 opacity-30" />
          <p>No rates set for today.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-500 uppercase text-xs tracking-wide">
                  <th className="text-left py-3 px-3">Product</th>
                  <th className="text-left py-3 px-3">Rate</th>
                  <th className="text-left py-3 px-3">Unit</th>
                  <th className="text-left py-3 px-3">Stock</th>
                  <th className="text-left py-3 px-3">Availability</th>
                  <th className="text-right py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-3 font-semibold text-gray-800">{r.name}</td>
                    <td className="py-3 px-3 text-green-700 font-bold">₹{r.rate}</td>
                    <td className="py-3 px-3 text-gray-500">/{r.unit}</td>
                    <td className="py-3 px-3 text-gray-500">
                      {r.weight != null ? `${r.weight} ${r.weight_unit}` : '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${availColor(r.availability)}`}>
                        {r.availability}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => openEdit(r)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Edit">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {rates.map((r) => (
              <div key={r.id} className="p-3 border border-gray-200 rounded-xl">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800">{r.name}</p>
                    <p className="text-green-700 font-bold text-lg">₹{r.rate}<span className="text-gray-400 text-sm font-normal">/{r.unit}</span></p>
                    {r.weight != null && <p className="text-gray-500 text-sm">Stock: {r.weight} {r.weight_unit}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${availColor(r.availability)}`}>{r.availability}</span>
                    <button onClick={() => openEdit(r)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                      <Edit2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-800">{editRate ? 'Edit Rate' : 'Set Today\'s Rate'}</h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {!editRate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product <span className="text-red-500">*</span></label>
                  <select
                    value={form.product_id}
                    onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                    required
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Rate (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                  >
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Weight</label>
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                    placeholder="e.g. 50"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Weight Unit</label>
                  <select
                    value={form.weight_unit}
                    onChange={(e) => setForm({ ...form, weight_unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                  >
                    {WEIGHT_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Availability</label>
                <div className="flex gap-2 flex-wrap">
                  {AVAILABILITY.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setForm({ ...form, availability: a })}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                        form.availability === a
                          ? a === 'Available' ? 'bg-green-600 text-white border-green-600'
                            : a === 'Limited' ? 'bg-yellow-500 text-white border-yellow-500'
                            : 'bg-red-500 text-white border-red-500'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'Saving...' : editRate ? 'Update' : 'Set Rate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatesTab;
