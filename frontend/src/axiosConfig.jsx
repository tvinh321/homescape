import axios from "axios";

const baseURL = "";

const axiosConfig = axios.create({
  baseURL,
});

export default axiosConfig;
export { baseURL };
