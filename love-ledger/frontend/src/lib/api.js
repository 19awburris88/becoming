const BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}, token) {
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  relationships: {
    list: (token) => request('/relationships', {}, token),
    get: (id, token) => request(`/relationships/${id}`, {}, token),
    create: (data, token) => request('/relationships', { method: 'POST', body: JSON.stringify(data) }, token),
    update: (id, data, token) => request(`/relationships/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),
    delete: (id, token) => request(`/relationships/${id}`, { method: 'DELETE' }, token),
  },
  dates: {
    list: (token, personId) =>
      request(`/dates${personId ? `?personId=${personId}` : ''}`, {}, token),
    create: (data, token) => request('/dates', { method: 'POST', body: JSON.stringify(data) }, token),
    update: (id, data, token) => request(`/dates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),
    delete: (id, token) => request(`/dates/${id}`, { method: 'DELETE' }, token),
  },
  memories: {
    list: (token, personId) =>
      request(`/memories${personId ? `?personId=${personId}` : ''}`, {}, token),
    create: (data, token) => request('/memories', { method: 'POST', body: JSON.stringify(data) }, token),
    update: (id, data, token) => request(`/memories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),
    delete: (id, token) => request(`/memories/${id}`, { method: 'DELETE' }, token),
  },
  gifts: {
    list: (token, personId) =>
      request(`/gifts${personId ? `?personId=${personId}` : ''}`, {}, token),
    create: (data, token) => request('/gifts', { method: 'POST', body: JSON.stringify(data) }, token),
    update: (id, data, token) => request(`/gifts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),
    delete: (id, token) => request(`/gifts/${id}`, { method: 'DELETE' }, token),
  },
}
