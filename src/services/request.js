import axios from "axios";

const token = window.localStorage.accessToken;

const axiosInstance = axios.create({
  baseURL: "https://theraponto.dev.thera.com.br:4433/api",
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const api = {
  post(url, options){
    return axiosInstance.post(url, options);
  },
  get(url) {
    return axiosInstance.get(url);
  },
  put(url, options){
    return axiosInstance.put(url, options);
  }
}