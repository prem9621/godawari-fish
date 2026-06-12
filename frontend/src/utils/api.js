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
export { API_BASE_URL };

// Helper to handle fetch responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(res);
  },

  // Products
  getProducts: async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    return handleResponse(res);
  },

  getProduct: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(res);
  },

  createProduct: async (formData, token) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return handleResponse(res);
  },

  updateProduct: async (id, formData, token) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return handleResponse(res);
  },

  deleteProduct: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },

  // Rates
  getRates: async () => {
    const res = await fetch(`${API_BASE_URL}/rates`);
    return handleResponse(res);
  },

  getRateHistory: async (productId) => {
    const res = await fetch(`${API_BASE_URL}/rates/history/${productId}`);
    return handleResponse(res);
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
    return handleResponse(res);
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
    return handleResponse(res);
  },

  // Reviews
  getReviews: async () => {
    const res = await fetch(`${API_BASE_URL}/reviews`);
    return handleResponse(res);
  },

  getAdminReviews: async (token) => {
    const res = await fetch(`${API_BASE_URL}/reviews/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },

  createReview: async (review) => {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    return handleResponse(res);
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
    return handleResponse(res);
  },

  // Site Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE_URL}/settings`);
    return handleResponse(res);
  },

  updateSettings: async (formData, token) => {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // multipart — owner_image is a file
    });
    return handleResponse(res);
  },

  // Buying view — one row per product with its latest rate + weight
  getProductsWithRates: async () => {
    const res = await fetch(`${API_BASE_URL}/products-with-rates`);
    return handleResponse(res);
  },

  // Inquiries
  createInquiry: async (inquiry) => {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    return handleResponse(res);
  },

  getInquiries: async (token) => {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
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
    return handleResponse(res);
  },
};
