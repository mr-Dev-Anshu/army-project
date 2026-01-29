// config/axios.ts

import { setMissingFields } from "@/context/validationDispatcher";
import { getMissingFields } from "@/utils/getEmptyFields";
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

// Add request interceptor for development bypass
api.interceptors.request.use((config) => {
  // Temporary development bypass: inject superadmin role
  // This matches the strategy mentioned in DEV_NOTE_AUTH_BYPASS.txt
  config.headers["x-user-role"] = "superadmin";
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    let message: any = "Something went wrong";

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

    const messageStr = typeof message === "string" ? message : JSON.stringify(message);

    if (
      !publicRoute &&
      (status === 401 ||
        status === 403 ||
        (messageStr &&
          (messageStr.toLowerCase().includes("unauthorized") ||
            messageStr.toLowerCase().includes("token expired") ||
            messageStr.toLowerCase().includes("unauthenticated") ||
            messageStr.toLowerCase().includes("invalid token"))))) {
      if (typeof window !== "undefined") {
        // window.location.href = "/login";
      }
      return Promise.reject(
        new Error("Session expired. Redirecting to login...")
      );
    }

    if (error.response) {
      error.message = typeof message === "string" ? message : messageStr;
    }

    return Promise.reject(error);
  }
);

//  REQUEST INTERCEPTOR

api.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    const data = config.data;
    console.log("missing fields data", data);

    // 🧠 Extract missing fields from request body
    const missingFields = getMissingFields(data);

    if (missingFields.length > 0) {
      // Pause request and prompt user
      return new Promise((resolve, reject) => {
        setMissingFields(
          url,
          missingFields,
          () => resolve(config), // onConfirm: proceed with request
          () =>
            reject({ // onCancel: abort request
              isClientValidationError: true,
              message: "Request cancelled by user due to missing fields",
            })
        );
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
