import express from "express";
import {register_user,login_user,get_current_user,logout_user} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/register",authRateLimiter,register_user);
router.post("/login",authRateLimiter,login_user);
router.get("/me",authMiddleware,get_current_user)
router.get("/logout",logout_user)


export default router;
