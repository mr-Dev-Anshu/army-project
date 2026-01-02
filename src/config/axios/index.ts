// config/axios.ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;


const publicRoutes = ["/login", "/register", "/"] as const;

// Updated: Check if path starts with these instead of exact match
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
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
});

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
        message = String(responseData.message);
      } else if (responseData.error) {
        // Handle error as string or object
        if (typeof responseData.error === "string") {
          message = responseData.error;
        } else if (typeof responseData.error === "object") {
          message = JSON.stringify(responseData.error);
        }
      }
    }

    const publicRoute = isPublicRoute(currentPath);
    console.log(publicRoute, currentPath);

    if (
      !publicRoute &&
      (status === 401 ||
        status === 403 ||
        (message &&
          typeof message === "string" &&
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
