const BASE_URL = '/api';

/**
 * Universal API Request Wrapper
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('lsf_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

// 1. Auth APIs
export const authAPI = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  logout: () => request('/auth/logout', { method: 'POST' })
};

// 2. Categories API
export const categoryAPI = {
  getAll: () => request('/categories'),
  getByIdOrSlug: (idOrSlug) => request(`/categories/${idOrSlug}`)
};

// 3. Providers & Search API
export const providerAPI = {
  search: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        queryParams.append(key, val);
      }
    });
    const qs = queryParams.toString();
    return request(`/providers${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/providers/${id}`),
  updateProfile: (data) => request('/providers/profile', { method: 'PUT', body: JSON.stringify(data) }),
  toggleAvailability: (is_available) => request('/providers/availability', { method: 'PUT', body: JSON.stringify({ is_available }) })
};

// 4. Services API
export const serviceAPI = {
  getByProvider: (providerId) => request(`/services/provider/${providerId}`),
  create: (serviceData) => request('/services', { method: 'POST', body: JSON.stringify(serviceData) }),
  delete: (serviceId) => request(`/services/${serviceId}`, { method: 'DELETE' })
};

// 5. Bookings API
export const bookingAPI = {
  create: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getAll: (status) => request(`/bookings${status ? `?status=${status}` : ''}`),
  getById: (id) => request(`/bookings/${id}`),
  updateStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
};

// 6. Reviews API
export const reviewAPI = {
  create: (reviewData) => request('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  getByProvider: (providerId) => request(`/reviews/provider/${providerId}`),
  reply: (reviewId, provider_response) => request(`/reviews/${reviewId}/reply`, { method: 'PUT', body: JSON.stringify({ provider_response }) })
};

// 7. Favorites API
export const favoriteAPI = {
  getAll: () => request('/favorites'),
  add: (provider_id) => request('/favorites', { method: 'POST', body: JSON.stringify({ provider_id }) }),
  remove: (provider_id) => request(`/favorites/${provider_id}`, { method: 'DELETE' })
};

// 8. Messages API
export const messageAPI = {
  getConversations: () => request('/messages'),
  getThread: (targetUserId) => request(`/messages/${targetUserId}`),
  send: (messageData) => request('/messages', { method: 'POST', body: JSON.stringify(messageData) })
};

// 9. Stats API
export const statAPI = {
  getProviderStats: () => request('/stats/provider'),
  getCustomerStats: () => request('/stats/customer'),
  getPlatformStats: () => request('/stats/platform')
};

// 10. Notifications API
export const notificationAPI = {
  getAll: () => request('/notifications'),
  markAsRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () => request('/notifications/read-all', { method: 'PUT' })
};

// 11. Admin API
export const adminAPI = {
  getStats: () => request('/admin/stats'),
  getUsers: () => request('/admin/users'),
  getProviders: () => request('/admin/providers'),
  verifyProvider: (id, status) => request(`/admin/providers/${id}/verify`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getBookings: () => request('/admin/bookings'),
  getReviews: () => request('/admin/reviews'),
  deleteReview: (id) => request(`/admin/reviews/${id}`, { method: 'DELETE' })
};

export default {
  auth: authAPI,
  categories: categoryAPI,
  providers: providerAPI,
  services: serviceAPI,
  bookings: bookingAPI,
  reviews: reviewAPI,
  favorites: favoriteAPI,
  messages: messageAPI,
  stats: statAPI,
  notifications: notificationAPI,
  admin: adminAPI
};
