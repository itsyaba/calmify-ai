import axios from "axios";

const BASE_URL = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: "https://intern-project-backend-sigma.vercel.app",
  withCredentials: true,
});

export default BASE_URL;
