import React, { useState, useEffect, useRef } from 'react';
import { api, resolveImageUrl } from '../../utils/api';
import { ImageIcon, Loader2, Save, CheckCircle } from 'lucide-react';

const SettingsTab = ({ token }) => {
  const [form, setForm] = useState({
    owner_name: '',
    owner_role: '',
    owner_bio: '',
    business_story: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getSettings();
      setForm({
        owner_name: data.owner_name || '',
        owner_role: data.owner_role || '',
        owner_bio: data.owner_bio || '',
        business_story: data.business_story || '',
      });
      if (data.owner_image_url) {
        setImagePreview(resolveImageUrl(data.owner_image_url));
      }
    } catch {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const fd = new FormData();
      fd.append('owner_name', form.owner_name);
      fd.append('owner_role', form.owner_role);
      fd.append('owner_bio', form.owner_bio);
      fd.append('business_story', form.business_story);
      if (imageFile) fd.append('owner_image', imageFile);

      await api.updateSettings(fd, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center py-16 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={20} /> Loading settings...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Site Settings</h2>
        {saved && (
          <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
            <CheckCircle size={16} /> Saved!
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Owner Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Photo</label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div
              onClick={() => fileRef.current.click()}
              className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition flex-shrink-0"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Owner" className="w-full h-full object-cover" />
              ) : (
                <>
                  <ImageIcon size={28} className="text-gray-300 mb-1" />
                  <p className="text-xs text-gray-400 text-center px-2">Upload photo</p>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p className="font-semibold text-gray-700 mb-1">Upload owner profile photo</p>
              <p>Recommended: Square image, at least 200×200px.</p>
              <p>Formats: JPG, PNG, WebP</p>
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="mt-2 text-blue-600 hover:underline text-sm font-semibold"
              >
                Choose file
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 space-y-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Owner Profile</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Name</label>
              <input
                type="text"
                value={form.owner_name}
                onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                placeholder="e.g. Sameer Qureshi"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Role / Title</label>
              <input
                type="text"
                value={form.owner_role}
                onChange={(e) => setForm({ ...form, owner_role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                placeholder="e.g. Owner · Sameer Qureshi & Brothers"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Short Bio</label>
            <textarea
              value={form.owner_bio}
              onChange={(e) => setForm({ ...form, owner_bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
              rows={3}
              placeholder="1–2 sentence tagline shown on the About page..."
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 space-y-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Business Story</p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Our Story</label>
            <textarea
              value={form.business_story}
              onChange={(e) => setForm({ ...form, business_story: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
              rows={6}
              placeholder="Full business story shown on the About page..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-semibold disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsTab;
