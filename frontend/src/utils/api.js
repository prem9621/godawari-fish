const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const buildUploadsUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Strip /api from the API base to get the backend origin
  const origin = API_BASE_URL.replace(/\/api$/, '');
  return `${origin}${path}`;
};

// Helper so image URLs from the backend (e.g. "/uploads/owner.jpg")
// are resolved against the real backend origin, not the frontend dev port.
export const resolveImageUrl = buildUploadsUrl;

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  // Products
  getProducts: async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    return res.json();
  },

  getProduct: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return res.json();
  },

  createProduct: async (formData, token) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },

  updateProduct: async (id, formData, token) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },

  deleteProduct: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Rates
  getRates: async () => {
    const res = await fetch(`${API_BASE_URL}/rates`);
    return res.json();
  },

  getRateHistory: async (productId) => {
    const res = await fetch(`${API_BASE_URL}/rates/history/${productId}`);
    return res.json();
  },

  createRate: async (rate, token) => {
    const res = await fetch(`${API_BASE_URL}/rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rate),
    });
    return res.json();
  },

  updateRate: async (id, rate, token) => {
    const res = await fetch(`${API_BASE_URL}/rates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rate),
    });
    return res.json();
  },

  // Reviews
  getReviews: async () => {
    const res = await fetch(`${API_BASE_URL}/reviews`);
    return res.json();
  },

  getAdminReviews: async (token) => {
    const res = await fetch(`${API_BASE_URL}/reviews/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  createReview: async (review) => {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    return res.json();
  },

  updateReviewVisibility: async (id, visible, token) => {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ visible }),
    });
    return res.json();
  },

  // Site Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE_URL}/settings`);
    return res.json();
  },

  updateSettings: async (formData, token) => {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // multipart — owner_image is a file
    });
    return res.json();
  },

  // Buying view — one row per product with its latest rate + weight
  getProductsWithRates: async () => {
    const res = await fetch(`${API_BASE_URL}/products-with-rates`);
    return res.json();
  },

  // Inquiries
  createInquiry: async (inquiry) => {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    return res.json();
  },

  getInquiries: async (token) => {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  updateInquiry: async (id, status, token) => {
    const res = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
};
