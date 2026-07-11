import api from "@/api/axios";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
} from "@/types/auth";

export async function login(
  data: LoginRequest,
): Promise<LoginResponse> {
  const response = await api.post(
    "/api/auth/login",
    new URLSearchParams({
      username: data.email,
      password: data.password,
    }),
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
}

export async function register(
  data: RegisterRequest,
) {
  const response = await api.post(
    "/api/auth/register",
    {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  );

  return response.data;
}