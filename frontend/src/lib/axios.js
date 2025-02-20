import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5007/api" : "https://himalayaglobal.store/api",
  withCredentials: true,
});
