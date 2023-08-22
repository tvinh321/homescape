import axios from "axios";

const baseURL = "http://localhost:8080";

const axiosConfig = axios.create({
  baseURL,
});

export default axiosConfig;
export { baseURL };
