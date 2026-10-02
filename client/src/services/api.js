const envApi = import.meta.env.VITE_API_URL || '';
const BASE_URL = envApi ? (envApi.endsWith('/api') ? envApi : `${envApi.replace(/\/+$/, '')}/api`) : '/api';

// Track server availability this session
let _serverAlive = false;

/**
 * Ping the backend to wake it up early (Render free tier cold-start)
 * Call this on app load so the server is warm before the user tries to log in.
 */
export async function pingServer() {
  if (_serverAlive) return true;
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 35000);
    const res = await fetch(`${BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(tid);
    if (res.ok) { _serverAlive = true; return true; }
  } catch { /* ignore - server may still be starting */ }
  return false;
}

/**
 * Universal API Request Wrapper with retry support for Render cold-start
 */
async function request(endpoint, options = {}, retries = 2) {
  const token = localStorage.getItem('lsf_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = { ...options, headers };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      // First attempt: 35s (Render free tier can take up to 30s to wake from sleep)
      // Retries: 15s each
      const timeoutId = setTimeout(() => controller.abort(), attempt === 0 ? 35000 : 15000);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...config,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      _serverAlive = true;

      const contentType = response.headers.get('content-type') || '';
      
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        let parsed = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          // Response is HTML or plain text (e.g. 404, 502, proxy error)
          if (attempt < retries) {
            await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
            continue;
          }
          throw new Error(
            `Server is starting up, please wait a moment and try again. (${response.status})`
          );
        }
        data = parsed;
      }

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      const isNetworkError = error.name === 'AbortError' || error.name === 'TypeError' || error.message.includes('fetch');
      if (isNetworkError && attempt < retries) {
        console.warn(`API retry ${attempt + 1}/${retries} on ${endpoint}:`, error.message);
        // Exponential backoff: 3s first retry, 6s second
        await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
        continue;
      }
      console.error(`API Error on ${endpoint}:`, error.message);
      if (error.name === 'AbortError') {
        throw new Error('Server is taking too long to respond. It may be waking up — please wait a moment and try again.');
      }
      throw error;
    }
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
