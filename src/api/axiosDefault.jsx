import axios from "axios";

axios.defaults.baseURL =
  "https://friendventure-api-8b417af3d1a0.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosRequest = axios.create();
export const axiosResponse = axios.create();
