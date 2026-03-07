import api from "../lib/axios";

export const loginUser = async (data:any) => {
  const res = await api.post("/auth/login", data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const registerUser = async (data:any) => {
  return api.post("/auth/register", data);
};