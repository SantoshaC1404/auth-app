import { registerApi, loginApi } from "@/api/auth.api";
import type { RegisterRequest, LoginRequest } from "@/models/auth.model";

export const registerUser = async (data: RegisterRequest) => {
  const response = await registerApi(data);
  return response.data;
};

export const loginUser = async (data: LoginRequest) => {
  const response = await loginApi(data);
  return response.data;
};
