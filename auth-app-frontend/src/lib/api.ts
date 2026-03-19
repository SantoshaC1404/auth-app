import axios, { type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Public axios instance — no auth header, used for login/register/refresh.
 */
export const publicApi = axios.create({
  baseURL: API_URL,
  withCredentials: true, // sends HttpOnly refresh-token cookie automatically
  headers: { "Content-Type": "application/json" },
});

/**
 * Protected axios instance — attaches the access token from Zustand store.
 * Automatically attempts a silent token refresh on 401 responses.
 */
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor: attach Bearer access token ─────────────────────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: silent refresh on 401 ─────────────────────────────
let refreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original: AxiosRequestConfig & { _retry?: boolean } = error.config;

    // Only attempt refresh once per request, and only on 401
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (refreshing) {
      // Queue subsequent 401s until the refresh resolves
      return new Promise((resolve) => {
        refreshQueue.push((newToken: string) => {
          original.headers = {
            ...original.headers,
            Authorization: `Bearer ${newToken}`,
          };
          resolve(api(original));
        });
      });
    }

    refreshing = true;

    try {
      const { data } = await publicApi.post("/auth/refresh-token");
      const newToken: string = data.accessToken;

      useAuthStore.getState().setAuth(
        {
          id: data.userDto.id,
          name: data.userDto.name,
          email: data.userDto.email,
          image: data.userDto.image,
          roles: data.userDto.roles.map((r: { name: string }) => r.name),
        },
        newToken,
      );

      // Drain queue
      refreshQueue.forEach((cb) => cb(newToken));
      refreshQueue = [];

      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return api(original);
    } catch {
      useAuthStore.getState().logout();
      refreshQueue = [];
      return Promise.reject(error);
    } finally {
      refreshing = false;
    }
  },
);
