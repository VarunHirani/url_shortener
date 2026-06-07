import {generateNanoId} from "../utils/helper.js";
//import urlSchema from "../models/short_url.model.js";
import {getCustomShortUrl, saveShortUrl} from "../dao/short_url.js";
export const createShortUrlWithoutUser  = async (url)=>{
    const shortUrl = generateNanoId(7); // Generate a unique short URL identifier 
    if(!shortUrl) throw new BadRequestError("Short URL generation failed");
    await saveShortUrl(shortUrl,url)
    console.log(shortUrl); // Log the newly created URL document
    return shortUrl;

}

export const createShortUrlWithUser  = async (url, userId, slug = null)=>{
    const shortUrl = slug || generateNanoId(7); // Generate a unique short URL identifier 
    const exists = await getCustomShortUrl(slug)
    if(exists) throw new Error("This custom url already exists")
    await saveShortUrl(shortUrl,url,userId)
    return shortUrl;
}