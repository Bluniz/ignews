import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

// https://ignews-nine.vercel.app
