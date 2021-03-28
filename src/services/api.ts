import axios from "axios";

export const api = axios.create({
  baseURL: "https://ignews-puce.vercel.app/api",
});
