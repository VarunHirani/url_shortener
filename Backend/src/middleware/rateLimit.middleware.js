import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success:false,
        message:"Too many authentication attempts. Please try again in 15 minutes."
    }
});

export const createUrlRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success:false,
        message:"Too many URL creation requests. Please slow down and try again shortly."
    }
});
