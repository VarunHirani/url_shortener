import axios from "axios";
import axiosInstance from "../utils/axiosInstance.js";
export const createShortUrl = async (url,slug)=>{
    const {data} =  await axiosInstance.post("/api/create",{url,slug})
    return data.shortUrl;
}