import axiosInstance from "../utils/axiosInstance.js";
export const createShortUrl = async (url,slug)=>{
    const {data} =  await axiosInstance.post("/api/create",{url,slug})
    return data.shortUrl;
}

export const deleteShortUrl = async (id)=>{
    const {data} = await axiosInstance.delete(`/api/create/${id}`)
    return data;
}
