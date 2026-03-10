import { publicApi, api } from "@/lib/api";
import type {
  RegisterRequest,
  LoginRequest,
  TokenResponse,
  UserDto,
} from "@/models/auth.model";

/** POST /auth/register */
export const registerApi = (data: RegisterRequest) =>
  publicApi.post<UserDto>("/auth/register", data);

/** POST /auth/login  — refresh token arrives via HttpOnly cookie */
export const loginApi = (data: LoginRequest) =>
  publicApi.post<TokenResponse>("/auth/login", data);

/** POST /auth/refresh-token — cookie is sent automatically (withCredentials) */
export const refreshTokenApi = () =>
  publicApi.post<TokenResponse>("/auth/refresh-token");

/** POST /auth/logout — revokes server-side refresh token + clears cookie */
export const logoutApi = () => api.post<void>("/auth/logout");
