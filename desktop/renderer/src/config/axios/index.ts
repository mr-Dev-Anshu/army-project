// config/axios.ts
import axios from "axios";
import offlineRequest, { isElectron } from "../offlineApi";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const publicRoutes = ["/login", "/register", "/"] as const;

const isPublicRoute = (path: string) => {
  if (!path) return false;
  return (
    publicRoutes.includes(path as typeof publicRoutes[number]) ||
    path.includes("/user-verification/") ||
    path.includes("/user-verification")
  );
};

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
});

// Custom adapter for Electron offline mode
if (isElectron) {
  api.defaults.adapter = async (config) => {
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url || '';
    let data: unknown;
    
    if (config.data) {
      try {
        data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      } catch {
        data = config.data;
      }
    }

    try {
      const result = await offlineRequest(method, url, data);
      return {
        data: result.data,
        status: result.status,
        statusText: result.statusText,
        headers: {},
        config,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    let message = "Something went wrong";

    if (responseData) {
      if (typeof responseData === "string") {
        message = responseData.slice(0, 200);
      } else if (responseData.message) {
        message = responseData.message;
      } else if (responseData.error) {
        message = responseData.error;
      }
    }

    const publicRoute = isPublicRoute(currentPath);
    console.log(publicRoute, currentPath);

    if (
      !publicRoute &&
      (status === 401 ||
        status === 403 ||
        (message &&
          (message.toLowerCase().includes("unauthorized") ||
            message.toLowerCase().includes("token expired") ||
            message.toLowerCase().includes("unauthenticated") ||
            message.toLowerCase().includes("invalid token"))))
    ) {
      if (typeof window !== "undefined") {
        // window.location.href = "/login";
      }
      return Promise.reject(
        new Error("Session expired. Redirecting to login...")
      );
    }

    if (error.response) {
      error.message = message;
    }

    return Promise.reject(error);
  }
);

export default api;
