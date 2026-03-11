import { registerUser } from "@/services/auth.service";

export const useRegister = () => {
  const register = async (data: any) => {
    return await registerUser(data);
  };

  return { register };
};
