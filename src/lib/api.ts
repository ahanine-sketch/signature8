"use client";

// Use same-origin Next.js proxy to avoid CORS entirely
// Browser → localhost:3000/api → (server-side) → localhost:5001/api
const API_BASE_URL = '/api';

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('s8_token');
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // We should NOT set Content-Type for FormData
  const isFormData = options.body instanceof FormData;
  if (!headers.has('Content-Type') && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  console.log(`🌐 API Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Si la session est expirée ou invalide (401)
    if (response.status === 401) {
      localStorage.removeItem('s8_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  // Handle 240 No Content (common for DELETE)
  if (response.status === 204) {
    console.log(`✅ API Success (No Content): ${endpoint}`);
    return {};
  }

  const data = await response.json();
  console.log(`✅ API Success: ${endpoint}`, data);
  return data;
}

export const api = {
  get: (endpoint: string) => fetcher(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => fetcher(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) => fetcher(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetcher(endpoint, { method: 'DELETE' }),
  upload: (endpoint: string, formData: FormData) => fetcher(endpoint, { method: 'POST', body: formData }),
  fetcher,
};

export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),
};

export const commercialApi = {
  getKpis: () => api.get("/kpis/commercial"),
  updateObjective: (objectif: number) => api.post("/kpis/commercial/objective", { objectif }),
  addExpense: (source: string, montant: number) => api.post("/kpis/commercial/expense", { source, montant }),
};

export const strategicApi = {
  getKpis: () => api.get("/kpis/strategic"),
};

export const requestsApi = {
  getAll: () => api.get("/demandes"),
  create: (data: any) => api.post("/demandes", data),
  update: (id: string, data: any) => api.patch(`/demandes/${id}`, data),
  updateStatus: (id: string, statut: string) => api.patch(`/demandes/${id}/statut`, { statut }),
  delete: (id: string) => api.delete(`/demandes/${id}`),
};

export const responsablesApi = {
  getAll: () => api.get("/responsables"),
  getProfile: (email: string) => api.get(`/responsables/profile?email=${email}`),
  create: (data: any) => api.post("/responsables", data),
  update: (id: string, data: any) => api.patch(`/responsables/${id}`, data),
  delete: (id: string) => api.delete(`/responsables/${id}`),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.upload("/upload", formData);
  }
};

export const portfolioApi = {
  getAll: () => api.get("/public/portfolio"),
  createContact: (data: any) => api.post("/public/contact", data),
  create: (data: any) => api.post("/admin/projects", data),
  delete: (id: string) => api.delete(`/admin/projects/${id}`),
};

export const projectsApi = {
  getAll: () => api.get("/admin/projects"),
  create: (data: any) => api.post("/admin/projects", data),
  update: (id: string, data: any) => api.patch(`/admin/projects/${id}`, data),
  delete: (id: string) => api.delete(`/admin/projects/${id}`),
};

export const clientsApi = {
  getAll: () => api.get("/admin/clients"),
  create: (data: any) => api.post("/admin/clients", data),
  update: (id: string, data: any) => api.patch(`/admin/clients/${id}`, data),
  delete: (id: string) => api.delete(`/admin/clients/${id}`),
};
 
export const devisApi = {
  getAll: () => api.get("/devis"),
  getStats: () => api.get("/devis/stats"),
  create: (data: any) => api.post("/devis", data),
  update: (id: string, data: any) => api.patch(`/devis/${id}`, data),
  delete: (id: string) => api.delete(`/devis/${id}`),
};

export const retouchesApi = {
  create: (data: any) => api.post("/retouches", data),
  getByProject: (projectId: string) => api.get(`/retouches/project/${projectId}`),
};
