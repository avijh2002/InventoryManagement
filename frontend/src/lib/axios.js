import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5007/api" : "https://inventorymanagement-fynk.onrender.com/api",
  withCredentials: true,
});
