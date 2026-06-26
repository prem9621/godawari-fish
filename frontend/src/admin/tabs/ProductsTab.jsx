import React, { useState, useEffect, useRef } from 'react';
import { api, resolveImageUrl, API_BASE_URL } from '../../utils/api';
import { Plus, Trash2, Edit2, X, ImageIcon, Loader2 } from 'lucide-react';

const emptyForm = { name: '', description: '' };

const ProductsTab = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null = add mode
  const [imageEditProduct, setImageEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading products:', err);
      // If we get an error, check if it's 401 - token invalid. We'll let the parent handle it by checking localStorage change
      setError(err.message || 'Failed to load products. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImageUrl('');
    setImagePreview('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description || '' });
    setImageFile(null);
    setImageUrl(p.image_url || '');
    setImagePreview(resolveImageUrl(p.image_url) || '');
    setShowModal(true);
  };

  const openImageEdit = (p) => {
    setImageEditProduct(p);
    setImageFile(null);
    setImageUrl(p.image_url || '');
    setImagePreview(resolveImageUrl(p.image_url) || '');
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setImageEditProduct(null);
    setImageFile(null);
    setImageUrl('');
    setImagePreview('');
  };

  const handleSaveImage = async (e) => {
    e.preventDefault();
    if ((!imageFile && !imageUrl) || !imageEditProduct) return;
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', imageEditProduct.name);
      fd.append('description', imageEditProduct.description || '');
      if (imageFile) {
        fd.append('image', imageFile);
      }
      if (imageUrl && !imageFile) {
        fd.append('image_url', imageUrl);
      }
      
      await api.updateProduct(imageEditProduct.id, fd, token);
      closeImageModal();
      await load();
    } catch (err) {
      console.error('Error saving image:', err);
      setError(err.message || 'Failed to save image. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImageUrl('');
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl('');
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null);
    if (url) {
      setImagePreview(url);
    } else if (imageEditProduct) {
      setImagePreview(resolveImageUrl(imageEditProduct.image_url) || '');
    } else if (editProduct) {
      setImagePreview(resolveImageUrl(editProduct.image_url) || '');
    } else {
      setImagePreview('');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('description', form.description.trim());
      if (imageFile) fd.append('image', imageFile);
      if (imageUrl && !imageFile) fd.append('image_url', imageUrl);

      if (editProduct) {
        await api.updateProduct(editProduct.id, fd, token);
      } else {
        await api.createProduct(fd, token);
      }
      
      closeModal();
      await load();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id, token);
      await load();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product.');
    }
  };
  
  const handleImportAll = async () => {
    if (!window.confirm('Import all 40+ fish products?')) return;
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/products/import-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        // If we can't parse JSON, it's probably HTML (404 or 500)
        throw new Error(`API not responding. Make sure backend server is running locally! ${response.status} ${response.statusText}`);
      }
      
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        throw new Error('Invalid token - please log in again');
      }

      if (data.error) throw new Error(data.error);
      alert(data.message);
      await load();
    } catch (err) {
      console.error('Error importing:', err);
      setError(err.message || 'Failed to import products');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Products</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <button
            onClick={handleImportAll}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl transition text-sm font-semibold w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            📥 Import All Products
          </button>
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl transition text-sm font-semibold w-full sm:w-auto"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ImageIcon size={40} className="mx-auto mb-2 opacity-30" />
          <p>No products yet. Add your first one!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-500 uppercase text-xs tracking-wide">
                  <th className="text-left py-3 px-3 w-16">Image</th>
                  <th className="text-left py-3 px-3">Name</th>
                  <th className="text-left py-3 px-3">Description</th>
                  <th className="text-right py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-3">
                      {p.image_url ? (
                        <img src={resolveImageUrl(p.image_url)} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-800">{p.name}</td>
                    <td className="py-3 px-3 text-gray-500 max-w-xs truncate">{p.description || '—'}</td>
                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openImageEdit(p)} className="p-3 text-purple-600 hover:bg-purple-50 rounded-xl transition" title="Change Image">
                          <ImageIcon size={20} />
                        </button>
                        <button onClick={() => openEdit(p)} className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition" title="Edit">
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition" title="Delete">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl">
                {p.image_url ? (
                  <img src={resolveImageUrl(p.image_url)} alt={p.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 flex-shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-gray-500 text-sm truncate">{p.description || '—'}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openImageEdit(p)} className="p-3 text-purple-600 hover:bg-purple-50 rounded-xl transition">
                    <ImageIcon size={20} />
                  </button>
                  <button onClick={() => openEdit(p)} className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {/* Image upload or URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-gray-300 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition overflow-hidden mb-3"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">Click to upload image</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Or paste image URL:</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/fish.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                  />
                </div>
                {imagePreview && editProduct && (
                  <button 
                    type="button"
                    onClick={() => { setImageFile(null); setImageUrl(''); setImagePreview(resolveImageUrl(editProduct.image_url) || ''); }}
                    className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Keep original image
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                  placeholder="e.g. Rohu Fish"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm resize-none"
                  rows={3}
                  placeholder="Short description..."
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? 'Saving...' : editProduct ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Image Modal */}
      {showImageModal && imageEditProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Change Image for {imageEditProduct.name}</h3>
              <button onClick={closeImageModal} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveImage} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Product Image</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-gray-300 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition overflow-hidden mb-3"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">Click to upload new image</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Or paste image URL:</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/fish.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                  />
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeImageModal} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={saving || (!imageFile && !imageUrl)} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl transition text-sm font-semibold flex items-center justify-center gap-2">
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? 'Saving...' : 'Update Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
