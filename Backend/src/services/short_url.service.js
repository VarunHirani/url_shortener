import {generateNanoId} from "../utils/helper.js";
//import urlSchema from "../models/short_url.model.js";
import {deleteUserShortUrl, getCustomShortUrl, saveShortUrl} from "../dao/short_url.js";
import {BadRequestError, ConflictError, NotFoundError} from "../utils/errorHandler.js";

const validateUrl = (url)=>{
    try{
        const parsedUrl = new URL(url);
        if(!["http:","https:"].includes(parsedUrl.protocol)){
            throw new Error("Invalid protocol");
        }
        return parsedUrl.href;
    }catch{
        throw new BadRequestError("Please enter a valid http or https URL");
    }
}

const validateSlug = (slug)=>{
    if(!slug) return null;
    const trimmedSlug = slug.trim();
    if(!/^[a-zA-Z0-9_-]{3,40}$/.test(trimmedSlug)){
        throw new BadRequestError("Custom slug must be 3-40 characters and use only letters, numbers, hyphens, or underscores");
    }
    return trimmedSlug;
}

export const createShortUrlWithoutUser  = async (url)=>{
    const validUrl = validateUrl(url);
    const shortUrl = generateNanoId(7); // Generate a unique short URL identifier 
    if(!shortUrl) throw new BadRequestError("Short URL generation failed");
    await saveShortUrl(shortUrl,validUrl)
    return shortUrl;

}

export const createShortUrlWithUser  = async (url, userId, slug = null)=>{
    const validUrl = validateUrl(url);
    const validSlug = validateSlug(slug);
    const shortUrl = validSlug || generateNanoId(7); // Generate a unique short URL identifier 
    const exists = validSlug ? await getCustomShortUrl(validSlug) : null
    if(exists) throw new ConflictError("This custom url already exists")
    await saveShortUrl(shortUrl,validUrl,userId)
    return shortUrl;
}

export const deleteShortUrlForUser = async (urlId,userId)=>{
    const deletedUrl = await deleteUserShortUrl(urlId,userId);
    if(!deletedUrl) throw new NotFoundError("URL not found or you do not have permission to delete it");
    return deletedUrl;
}
