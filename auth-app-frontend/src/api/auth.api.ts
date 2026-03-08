import { api } from "@/lib/api";
import type { RegisterRequest, LoginRequest } from "@/models/auth.model";

export const registerApi = (data: RegisterRequest) => {
  return api.post("/auth/register", data);
};

export const loginApi = (data: LoginRequest) => {
  return api.post("/auth/login", data);
};
