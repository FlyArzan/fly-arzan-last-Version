import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      const { status } = response;

      if (status === 401) {
        toast.error("Unauthorized");
      }
    }

    return Promise.reject(error);
  }
);

export { api };
export default api;
