import { apiFetch } from "@/lib/api/client";
import type {
  DashboardMeResponse,
  DashboardStudiosResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/api";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: payload,
    }),

  register: (payload: RegisterPayload) =>
    apiFetch("/api/auth/register", {
      method: "POST",
      body: payload,
    }),

  logout: () =>
    apiFetch("/api/auth/logout", {
      method: "POST",
    }),

  getMe: () => apiFetch<DashboardMeResponse>("/api/auth/me"),

  getStudios: () => apiFetch<DashboardStudiosResponse>("/api/auth/studios"),
};
