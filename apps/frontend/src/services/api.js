// Client API — toutes les requêtes vers le backend
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// === Cristaux ===
export const crystalApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/crystals${qs ? '?' + qs : ''}`);
  },
  getById: (id) => request(`/crystals/${id}`),
  getBySlug: (slug) => request(`/crystals/slug/${slug}`),
  create: (data) => request('/crystals', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/crystals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/crystals/${id}`, { method: 'DELETE' }),
  updateStock: (id, stock) => request(`/crystals/${id}/stock`, { method: 'PUT', body: JSON.stringify(stock) }),
  suggest: (params) => request('/crystals/suggest', { method: 'POST', body: JSON.stringify(params) }),
  generate: (params) => request('/crystals/generate', { method: 'POST', body: JSON.stringify(params) }),
  research: (params) => request('/crystals/research', { method: 'POST', body: JSON.stringify(params) }),
};

// === Chakras ===
export const chakraApi = {
  getAll: () => request('/chakras')
};

// === Zodiacs ===
export const zodiacApi = {
  getAll: () => request('/zodiacs')
};

// === Types de création ===
export const creationTypeApi = {
  getAll: () => request('/creation-types')
};
