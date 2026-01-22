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


api.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase()||"unkonwn";
    if (['POST', 'PUT', 'PATCH'].includes(method) && config.data) {
      const emptyFields = findEmptyOrNullFields(config.data);

      if (emptyFields.length > 0) {
        const message = 
          `⚠️ Ye fields khali ya null hain:\n\n` +
          emptyFields.join('\n') +
          `\n\nKya aap fir bhi request bhejna chahte hain?\n\n` +
          `OK → Bhej do (ignore karo)\n` +
          `Cancel → Wapas jaao aur fill karo`;

        const userWantsToProceed = confirm(message);

        if (!userWantsToProceed) {
          throw new axios.Cancel('User ne empty fields ke karan request cancel ki');
        }
       
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Request body:', config.data);
      console.log('Empty fields:', findEmptyOrNullFields(config.data));
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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






function findEmptyOrNullFields(obj, prefix = "", result = []) {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined || value === "") {
      result.push(currentPath);
    }
    // If it's an object (but not array) → recurse
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      findEmptyOrNullFields(value, currentPath, result);
    }
    // If it's array → you can decide whether to recurse or skip
    // (most form data arrays are usually not empty-check candidates)
  }

  return result;
}